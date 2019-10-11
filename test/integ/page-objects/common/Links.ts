import AddTest from '../tests/AddTest';
import { waitForAddTest, waitForProjects, waitForSprints, waitForHome} from './Wait';
import Projects from '../projects/Projects';
import Sprints from '../sprints/Sprints';
import Home from '../Home';

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

  public static sprints() {
    $('a[href="./sprints.html"]').click();
    waitForSprints();
    return new Sprints().waitToRender();
  }

  public static home() {
    $('a[href="./home.html"]').click();
    waitForHome();
    return new Home();

  }

}
