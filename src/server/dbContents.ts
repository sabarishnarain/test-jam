export namespace DBContents {
  const EMPTY: any[] = [];

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
    secrets : EMPTY,
    tests : EMPTY,
    sprints : [{ id : 1, name : 'sudosprint' }],
    testruns : EMPTY,
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
   };
}
