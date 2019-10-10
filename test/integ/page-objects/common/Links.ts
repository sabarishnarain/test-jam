import AddTest from '../tests/AddTest';
import { waitForAddTest, waitForProjects } from './Wait';
import Projects from '../projects/Projects';

export default class Links {

  public static addTest() {
    $('a[href="./addNewTest.html"]').click();
    waitForAddTest();
    return new AddTest().waitToRender();
  }

  public static projects() {
    $('a[href="./projects.html"]').click();
    waitForProjects();
    return new Projects().waitToRender();
  }

}
