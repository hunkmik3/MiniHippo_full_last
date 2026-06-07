import createAssignment from '../../../server/api/vstep/assignments/create.js';
import listAssignments from '../../../server/api/vstep/assignments/list.js';
import assignClass from '../../../server/api/vstep/classes/assign.js';
import createClass from '../../../server/api/vstep/classes/create.js';
import deleteClass from '../../../server/api/vstep/classes/delete.js';
import listClasses from '../../../server/api/vstep/classes/list.js';
import myClasses from '../../../server/api/vstep/classes/my.js';
import updateClass from '../../../server/api/vstep/classes/update.js';
import createContent from '../../../server/api/vstep/contents/create.js';
import removeContent from '../../../server/api/vstep/contents/delete.js';
import getContent from '../../../server/api/vstep/contents/get.js';
import listContents from '../../../server/api/vstep/contents/list.js';
import updateContent from '../../../server/api/vstep/contents/update.js';
import createResource from '../../../server/api/vstep/resources/create.js';
import listResources from '../../../server/api/vstep/resources/list.js';
import removeResult from '../../../server/api/vstep/results/delete.js';
import listResults from '../../../server/api/vstep/results/list.js';
import listMyResults from '../../../server/api/vstep/results/my-list.js';
import submitResult from '../../../server/api/vstep/results/submit.js';
import updateResult from '../../../server/api/vstep/results/update.js';
import createStudent from '../../../server/api/vstep/students/create.js';
import listStudents from '../../../server/api/vstep/students/list.js';
import bulkImportStudents from '../../../server/api/vstep/students/bulk-import.js';
import updateStudent from '../../../server/api/vstep/students/update.js';

const handlers = {
  assignments: {
    create: createAssignment,
    list: listAssignments
  },
  classes: {
    assign: assignClass,
    create: createClass,
    delete: deleteClass,
    list: listClasses,
    my: myClasses,
    update: updateClass
  },
  contents: {
    create: createContent,
    delete: removeContent,
    get: getContent,
    list: listContents,
    update: updateContent
  },
  resources: {
    create: createResource,
    list: listResources
  },
  results: {
    delete: removeResult,
    list: listResults,
    'my-list': listMyResults,
    my_list: listMyResults,
    submit: submitResult,
    update: updateResult
  },
  students: {
    'bulk-import': bulkImportStudents,
    bulk_import: bulkImportStudents,
    create: createStudent,
    list: listStudents,
    update: updateStudent
  }
};

export default async function handler(req, res) {
  const resource = String(req.query?.resource || '').toLowerCase();
  const action = String(req.query?.action || '').toLowerCase();
  const resourceHandlers = handlers[resource];
  const fn = resourceHandlers && resourceHandlers[action];
  if (!fn) {
    return res.status(404).json({ error: 'Unknown vstep action' });
  }
  return fn(req, res);
}
