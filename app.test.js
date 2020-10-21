import 'regenerator-runtime/runtime';
import MockAdapter from 'axios-mock-adapter';
import { instance, request } from './app';

describe('test axios instance', () => {
  const mock = new MockAdapter(instance);
  // - możesz wysłać zapytanie na adres GET /next?q=error
  it('should handle successfull get request', async () => {
    const data = { msg: 'ok' };
    mock.onGet('/next?q=error').reply(200, data);
    const response = await request('/next?q=error');
    expect(response.data).toEqual(data);
  });
  // - możesz obsłużyć błąd typu 500 oraz 404
  it('should handle http status 500 and 404 errors', async () => {
    const notFoundMsg = { msg: 'Not found' };
    const serverErrMsg = { msg: 'Server error' };
    mock.onGet('/notfound').reply(404, notFoundMsg);
    mock.onGet('/serverfail').reply(500, serverErrMsg);
    try {
      await request('/notfound');
    } catch ({ response }) {
      expect(response.data).toEqual(notFoundMsg);
      expect(response.status).toEqual(404);
    }
    try {
      await request('/serverfail');
    } catch ({ response }) {
      expect(response.data).toEqual(serverErrMsg);
      expect(response.status).toEqual(500);
    }
  });
  // - możesz wysłać plik na POST /file
  it('should handle file upload to POST /file', async () => {
    const successData = { msg: 'Success' };
    const file1 = 'niceFamilyPicture.jpg';
    const file2 = 'dopeTrack.mp3';
    const uploadedFiles = [];

    mock.onPost('/uploadfile').reply(config => {
      // push file to the store
      uploadedFiles.push(config.data);
      return [200, successData];
    });
    // add file 1
    await request('/uploadfile', { method: 'POST', data: file1 });
    expect(uploadedFiles).toHaveLength(1);
    // add file 2
    await request('/uploadfile', { method: 'POST', data: file2 });
    expect(uploadedFiles).toHaveLength(2);
    const [uploaded1, uploaded2] = uploadedFiles;
    expect(uploaded1).toEqual(file1);
    expect(uploaded2).toEqual(file2);
  });
  // - jeśli w config.query wejdzie {"key":"value"} to dawać url z końcówką ?key=value
  it('should parse config.query to a query string in url', async () => {
    const data = { msg: 'hello from query string page' };
    mock.onGet('/?key=value').reply(200, data);
    const response = await request('', { query: { key: 'value' } });
    expect(response.data).toEqual(data);
  });
  // - możesz obsłużyć błąd spowodowany timeoutem
  it('should handle a timeout error', async () => {
    mock.onGet('/timeoutPath').timeout();
    try {
      await request('/timeoutPath');
    } catch (e) {
      expect(e.response).toEqual(undefined);
      expect(e.code).toEqual('ECONNABORTED');
      expect(e.isAxiosError).toEqual(true);
    }
  });
});

export {};
