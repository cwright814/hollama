import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	timeout: 15000,
	workers: process.env.CI ? 1 : undefined,
	retries: process.env.CI ? 2 : 0,
	use: {
		browserName: 'firefox',
		trace: 'retain-on-failure',
		viewport: { width: 1280, height: 1024 },
		launchOptions: {
			firefoxUserPrefs: {
				'ui.primaryPointerCapabilities': 0x06,
				'dom.events.testing.asyncClipboard': true,
				'dom.events.asyncClipboard.readText': true,
				'dom.events.asyncClipboard.writeText': true
			}
		}
	},
	snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
	expect: {
		toMatchSnapshot: {
			maxDiffPixels: 900
		}
	}
};

export default config;
