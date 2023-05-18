import mondaySdk from '../types';
const monday = mondaySdk();

monday.api('test'); // $ExpectType Promise<{ data: object; }>

monday.setApiVersion('2023-10'); // $ExpectType void
mondaySdk({ apiVersion: '2023-10' });
monday.api('test', { apiVersion: '2023-07' }); // $ExpectType Promise<{ data: object; }>

monday.setToken('test'); // $ExpectType void

monday.get('context'); // $ExpectType Promise<any>
monday.get('settings'); // $ExpectType Promise<any>
monday.get('itemIds'); // $ExpectType Promise<any>
monday.get('sessionToken'); // $ExpectType Promise<any>

monday.set('settings', {'text' : 'this is a test', 'number' : 23}); // $ExpectType Promise<any>

monday.listen('context', res => res); // $ExpectType void

monday.execute('openItemCard', { itemId: 123 }); // $ExpectType Promise<any>
monday.execute('confirm', { message: 'Hello' }); // $ExpectType Promise<{ data: { confirm: boolean; }; }>
monday.execute('notice', { message: 'Hello' }); // $ExpectType Promise<any>
// $ExpectType Promise<any>
monday.execute('openFilesDialog', {
    boardId: 12345,
    itemId: 23456,
    columnId: 'files',
    assetId: 34567,
});
// $ExpectType Promise<any>
monday.execute('triggerFilesUpload', {
    boardId: 12345,
    itemId: 23456,
    columnId: 'files',
});
monday.execute('openAppFeatureModal', { urlPath: '/path', urlParams: {}, width: '100px', height: '100px' }); // $ExpectType Promise<{ data: any; }>
monday.execute('closeAppFeatureModal'); // $ExpectType Promise<{ data: any; }>
monday.execute('valueCreatedForUser'); // $ExpectType Promise<any}>
// $ExpectType Promise<any>
monday.execute('addDocBlock', {
    type : 'normal text',
    content : {'deltaFormat' : [{'insert' : 'test'}]}
});
// $ExpectType Promise<any>
monday.execute('updateDocBlock', {
    id : '1234-1234-23434dsf',
    content : {'deltaFormat' : [{'insert' : 'test'}]}
});
// $ExpectType Promise<any>
monday.execute('addMultiBlocks', {
    afterBlockId : '1234-1234-23434dsf',
    blocks: [
        { 
            type: 'normal text', 
            content: { deltaFormat : [{ 'insert' : 'test' }] }
        }
    ]
});
monday.execute('closeDocModal'); // $ExpectType Promise<any>

monday.oauth({ clientId: 'clientId' });

monday.storage.instance.getItem('test'); // $ExpectType Promise<GetResponse>
monday.storage.instance.setItem('test', '123'); // $ExpectType Promise<SetResponse>
monday.storage.instance.deleteItem('test'); // $ExpectType Promise<DeleteResponse>

const mondayServer = mondaySdk({ token: '123', apiVersion: '2023-10' });

mondayServer.setToken('123'); // $ExpectType void
mondayServer.setApiVersion('2023-10'); // $ExpectType void
mondayServer.api('test'); // $ExpectType Promise<any>
mondayServer.api('test', { token: 'test' }); // $ExpectType Promise<any>
mondayServer.api('test', { variables: { variable1: 'test' } }); // $ExpectType Promise<any>
mondayServer.api('test', { token: 'test', variables: { variable1: 'test' } }); // $ExpectType Promise<any>
mondayServer.api('test', { token: 'test', apiVersion: '2023-07' }); // $ExpectType Promise<any>
mondayServer.oauthToken('test', 'test', 'test'); // $ExpectType Promise<any>
