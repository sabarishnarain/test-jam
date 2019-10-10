import {waitForElements, waitForProjects} from '../common/Wait';
import EditTest from '../tests/EditTest';
import Projects from './Projects';
import Page from '../common/Page';

export default class Project extends Page{

   public waitToRender() {
     waitForElements(['#page-wrapper']);
     return this;
   }

   public deleteProject() {
     $('#deleteProject').click();
     waitForProjects();
     return new Projects().waitToRender();
   }

   public deleteTest() {
     $('#deleteTest').click();
     return this.waitToRender();
   }

   public rename(newName: string) {
     const currentName = this.getName();
     $('#newProjectName').addValue(newName);
     $('#renameProject').click();
     this.matchSnackbar(`Project "${currentName}" successfully renamed to "${newName}"`);
   }

   public getName() {
     return $('.section-header b').getText();
   }

   public getTests() {
     const tests = [];

     const rows = $$('.jdamTable tbody tr');

     for (const r of rows) {
       const cells = r.$$('td');
       const title = cells[1].getText();
       const desc = cells[2].getText();
       const testId = cells[3].getText();
       const identifier = cells[4].getText();

       tests.push( { title, desc, testId, identifier});
     }
     console.log(tests)
     return tests;
   }

   public isTestExistsById(testId: string) {
     return this.getTests().filter( (t) => t.testId === testId).length > 0;
   }

   public isTestExistsByTitle(title: string) {
     return this.getTests().filter( (t) => t.title === title).length > 0;
   }

   /**
    * 
    * @param title 
    */
   public openTestByTitle(title: string) {
     const test = this.getTests().filter( (t: any) => t.title === title)[0];
     if (!test) {
       throw new Error('Test with name ' + name + ' not found!!');
     }
     $('=' + test.testId).click();
     return new EditTest().waitToRender();
   }

   public openTestByIdentifier(identifier: string) {
     const test = this.getTests().filter( (t: any) => t.identifier === identifier)[0];
     if (!test) {
       throw new Error('Test with name ' + name + ' not found!!');
     }
     $('=' + test.testId).click();
     return new EditTest().waitToRender();
   }

   public selectTests(title: string[]) {
     const rows = $$('.jdamTable tbody tr');

     for (const r of rows) {
       const cells = r.$$('td');

       if (title.includes(cells[1].getText())) {
         cells[5].$('input').click();
       }
      }
     return this;
   }

   public selectAllTests() {
     $('#selectAll').click();
     return this;
   }
 } 