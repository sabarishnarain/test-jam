export namespace DBContents {
  const EMPTY: any[] = [];
  const SAMPLE_TESTDATA: any[] = [{id: 1, title : 'Sample Test1' , identifier : 'sampleTest1', project: 'sud7154'}];
  const SAMPLE_TESTDESC_DATA: any[] = [{ id : 1, desc : 'This is the description of sample test 1.'}];

  export const TEST = {
    users : [{ id : 1, username : 'sudouser',
      password : '$2b$10$rk4QavInGorSUjQSJiDRduWZmKvRWFNxXmGXHfJisCSdHUgxUZMDa', admin : 1}],
    projects : [ { id : 'sud7154', name : 'sudoproject' }],
    appConfig : {
      authentication : {
          requireSecret : true
      }
    },
    masterKey : { key : 'nobodyownsnothing' },
    secrets : ['samplekey1', 'samplekey2'],
    tests : SAMPLE_TESTDATA,
    sprints : [{ id : 1, name : 'sudosprint' }],
    testruns : EMPTY,
    testdesc: SAMPLE_TESTDESC_DATA
   };

  export const DEFAULT = {
    users : EMPTY,
    projects : EMPTY,
    appConfig : {
      authentication : {
          requireSecret : true
      }
    },
    masterKey : { key : 'nobodyownsnothing' },
    secrets : EMPTY,
    tests : EMPTY,
    sprints : EMPTY,
    testruns : EMPTY,
    testdesc: EMPTY
   };
}
