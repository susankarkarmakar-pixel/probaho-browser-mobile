describe('Probaho Browser mobile flows', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('home-tab')).tap();
  });

  it('renders the protected home dashboard', async () => {
    await expect(element(by.text('Probaho'))).toBeVisible();
    await expect(element(by.id('home-search-input'))).toBeVisible();
    await expect(element(by.id('open-privacy-dashboard'))).toBeVisible();
    await expect(element(by.text('Transparent security'))).toBeVisible();
  });

  it('opens privacy dashboard and returns home', async () => {
    await element(by.id('open-privacy-dashboard')).tap();
    await expect(element(by.id('privacy-dashboard-screen'))).toBeVisible();
    await expect(element(by.text('Privacy Dashboard'))).toBeVisible();
    await element(by.label('Back')).tap();
    await expect(element(by.text('Probaho'))).toBeVisible();
  });

  it('opens browser privacy protection and closes it', async () => {
    await element(by.id('browser-tab')).tap();
    await expect(element(by.id('browser-screen'))).toBeVisible();
    await element(by.id('open-privacy-protection')).tap();
    await expect(element(by.id('privacy-protection-sheet'))).toBeVisible();
    await element(by.id('close-privacy-protection')).tap();
    await expect(element(by.id('privacy-protection-sheet'))).not.toBeVisible();
  });

  it('opens the tab manager and creates a new tab', async () => {
    await element(by.id('tabs-tab')).tap();
    await expect(element(by.id('tabs-screen'))).toBeVisible();
    await element(by.id('new-tab-button')).tap();
    await expect(element(by.id('browser-screen'))).toBeVisible();
  });

  it('opens settings and replays onboarding', async () => {
    await element(by.id('settings-tab')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
    await element(by.text('Replay Onboarding')).tap();
    await expect(element(by.id('onboarding-screen'))).toBeVisible();
    await element(by.id('skip-onboarding')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
  });
});
