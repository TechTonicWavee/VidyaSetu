import { parseResume } from './lib/resume/parser'; parseResume('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf').then(console.log).catch(console.error);
