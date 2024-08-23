import * as Net from 'net';
import * as rokuDeploy from 'roku-deploy';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
const env = process.env;

env.CODE_COVERAGE = '';

const LOG_BREAK = '\n----- ';

process.on('unhandledRejection', (error: Error) => {
	console.error('Error: ', error);
	process.exit(1);
});

export class UnitTestRunner {
	public constructor(
		private host: string,
		private devicePassword: string
	) {
		console.log(`host: ${host}, pw: ${devicePassword}`);

	}

	// Create a new TCP client.
	private ioClient = new Net.Socket();

	private processLogs = false;

	private codeCoverage = new CodeCoverage();

	private results: {
		pass: boolean;
		message: string;
	};

	private testingLogs: string;

	private timeout = 5 * 60 * 1000 * (env.CODE_COVERAGE ? 2 : 1);

	private port = 8085;

	public async runTests() {
		let testResultsPromise = this.watch();
		await this.connect();
		await this.sideloadToDevice();
		await testResultsPromise;

		this.ioClient.end();

		console.log(LOG_BREAK, `Testing Completed:`);
		if (!this.results.pass) {
			throw new Error(`Unit testing failed: ${this.results.message}`);
		} else {
			console.log(`Tests completed successfully`);
		}
	}

	private updateResults(message: string, pass = false) {
		console.log(`Updating test results`);
		// this.processLogs = false
		this.results = {
			message: message,
			pass: pass
		};
	}

	private watch() {
		console.log(LOG_BREAK, `Preparing to watch Telnet logs from device `);
		return new Promise<void>((resolve, reject) => {
			// prep max timeout
			let timeoutId = setTimeout(() => {
				if (!this.results) {
					this.updateResults('Tests timed out');
				}
				this.ioClient.end();
				resolve();
			}, this.timeout);

			let lastPartialLine = '';
			this.ioClient.on('data', (buffer) => {
				let responseText = buffer.toString();
				if (!responseText.endsWith('\n')) {
					// buffer was split, save the partial line
					lastPartialLine += responseText;
				} else {
					if (lastPartialLine) {
						// there was leftover lines, join the partial lines back together
						responseText = lastPartialLine + responseText;
						lastPartialLine = '';
					}
					if (this.processLogs) {

						// Check for any runtime error and end the testing if found
						if (responseText.includes('BrightScript Micro Debugger.')) {
							this.updateResults('Runtime Crash in Tests');
							this.processLogs = false;
							clearTimeout(timeoutId);
							resolve();
						}

						// Remove and trailing new line at the end of the string and
						// split the string on the remaining new lines to parse and log
						// line by line
						let lines = responseText.replace(/\r?\n$/, '').split(/\r?\n/);
						for (let line of lines) {

							if (this.results) {
								// If we already have the results summery start looking for the code coverage information
								this.codeCoverage.processLogLine(line);
							}

							if (env.CODE_COVERAGE) {
								// Looking for the AppExitInitiate signal beacon. Once found we no longer need to watch
								// the logs for test results as the testing framework has requested the application be exited
								if (/\d+\-\d+\s\d+:\d+:\d+\.\d+\s\[beacon\.signal\]\s\|AppExitInitiate\s\-+\>\sTimeBase\(\d+\sms\)/gmis.exec(line)) {
									console.log(line);
									this.processLogs = false;
									clearTimeout(timeoutId);
									resolve();
								}
							}

							// Logging the telnet info so we can see it in the github actions logs
							console.log(line);
						}

						if (!this.results) {
							// We are still looking for the completed test summery
							let currentTestInfo = this.checkForResults(responseText);

							// Have we found the completed summery?
							if (currentTestInfo.status !== 'checking') {
								console.log(`Testing complete`);
								this.updateResults(currentTestInfo.message, currentTestInfo.status === 'passed');

								// Stop watching the logs if code coverage is not enabled
								if (!env.CODE_COVERAGE) {
									this.processLogs = false;
									clearTimeout(timeoutId);
									resolve();
								}
							}
						}

					}
				}
			});

			this.ioClient.on('end', () => {
				clearTimeout(timeoutId);
				console.log('Requested an end to the Telnet connection');
			});

			// Don't forget to catch error, for your own sake.
			this.ioClient.once('error', (err) => {
				console.log(`Error: ${err}`);
				this.updateResults(`Error with connection: ${err.message}`);
				clearTimeout(timeoutId);
				resolve();
			});
		});
	}

	public async connect() {
		// Send a connection request to the server.
		console.log('Connect to Telnet: port', this.port, 'host', this.host);
		return new Promise<void>((resolveConnect, rejectConnect) => {
			this.ioClient.connect({ port: this.port, host: this.host }, () => {
				// If there is no error, the server has accepted the request
				console.log('TCP connection established with the Telnet.');
				resolveConnect();
			});
		});
	}

	private checkForResults(logs: string) {
		this.testingLogs += logs;
		let currentTestInfo = {
			status: 'checking',
			message: ''
		};

		// regex and examples also available at: https://regex101.com/r/PPoFlq/1
		// Overall this regex is looking for the main summery results of the tests
		const resultRegex = /(?<fullMatch>Total:\s*(?<total>\d+)\s*Passed:\s*(?<passed>\d+)\s*Crashed:\s*(?<crashed>\d+)\s*Failed:\s*(?<failed>\d+)\s*Ignored:\s*(?<ignored>\d+)\s*Time:\s*(?<time>\d+ms)\s*RESULT:\s*(?<result>\w+))/gmis;

		let match = resultRegex.exec(this.testingLogs);

		if (match) {
			if (match.groups?.result.toLowerCase() === 'success') {
				currentTestInfo.status = 'passed';
			} else {
				currentTestInfo.status = 'failure';
			}

			currentTestInfo.message = match.groups?.fullMatch!;
		}

		return currentTestInfo;
	}

	private async sideloadToDevice() {
		try {
			console.log(LOG_BREAK, `Preparing to deploy to device: host: ${this.host}`);
			console.log('Delete installed channel if one exists');
			await rokuDeploy.deleteInstalledChannel({ host: this.host, password: this.devicePassword }).catch((error) => { });

			setTimeout(() => {
				this.processLogs = true;
			}, 1000);

			console.log(`Packaging and deploying to device.`);
			console.log(`Please wait this could take a few moments.....`);

			let result = await rokuDeploy.deploy({
				host: this.host,
				password: this.devicePassword,
				stagingDir: `${process.cwd()}/out/.roku-deploy-staging`,
				rootDir: `${process.cwd()}/dist/`,
				files: [
					'**/*'
				]
			});

			console.log(result.message);
		} catch (error) {
			console.log(error);
		}
	}
}

class CodeCoverage {
	public totalPercent: string;

	public linesSummery: { hit: string; total: string };

	public filesSummery: { hit: string; total: string };

	public coveredFiles: Array<{ filePath: string; coveragePercent: string; linesSummery: { hit: string; total: string } }> = [];

	public missedFiles: Array<string> = [];

	public processLogLine(line) {
		this.parseForTotalCoverageAndLineSummery(line);
		this.parseForFilesSummery(line);
		this.parseForFilesMissedAndCoveredFiles(line);
	}

	private parseForTotalCoverageAndLineSummery(line) {
		if (this.totalPercent) {
			return;
		}
		let match = /total\scoverage:\s(\d+\.\d+)%\s\((\d+)\/(\d+)\)/i.exec(line);
		if (match) {
			this.totalPercent = match[1];
			this.linesSummery = { hit: match[2], total: match[3] };
		}
	}

	private parseForFilesSummery(line) {
		if (this.filesSummery) {
			return;
		}
		let match = /files:\s+(\d+)\/\s?(\d+)/i.exec(line);
		if (match) {
			this.filesSummery = { hit: match[1], total: match[2] };
		}
	}

	private parseForFilesMissedAndCoveredFiles(line) {
		let match = /(pkg:.+\.brs):\s(\d+\.\d+)%\s\((\d+)\/(\d+)\)|(pkg:.+\.brs):\smiss!/i.exec(line);
		if (match) {
			if (match[1]) {
				this.coveredFiles.push({
					filePath: match[1],
					coveragePercent: match[2],
					linesSummery: {
						hit: match[3],
						total: match[4]
					}
				});
			} else {
				this.missedFiles.push(match[5]);
			}
		}
	}
}


new UnitTestRunner(env.ROKU_HOST!, env.ROKU_PASSWORD!)
	.runTests()
	.catch((e) => {
		console.log(e?.stack ?? e);
		process.exit(1);
	});
