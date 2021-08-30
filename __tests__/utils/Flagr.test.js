import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flagr from '../../public/dummy/Flagr.json';
import { featureEnable } from '../../utils/Flagr';

const BASE_URL = process.env.NEXT_PUBLIC_API_FLAGR_URL;

describe('On featureEnabled method called', () => {
  afterEach(() => {
    const mock = new MockAdapter(axios);
    mock.reset();
    jest.clearAllMocks();
  });

  it('Success scenario', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}flags/1`).reply(200, flagr);
    expect(await featureEnable(1)).toEqual(flagr.enabled)
  });

  it('Fail scenario unexpected error', async () => {
    const mAxios = new MockAdapter(axios);
    mAxios.onGet(`${BASE_URL}flags/1`).networkError();
    expect(await featureEnable(1)).toEqual(false)
  });
});
