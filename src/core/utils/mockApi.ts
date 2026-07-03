import { faker } from "@faker-js/faker";

export const generateFakeWorkOrders = (count = 10) => {
  return Array.from({ length: count }).map((_, index) => ({
    workOrderId: index + 1,
    workOrderNumber: `WO-${1000 + index}`,
    customerName: faker.company.name(),
    employeeName: faker.person.fullName(),
    statusWorkOrder: faker.number.int({ min: 0, max: 2 }),
    created: faker.date.recent().toISOString(),
  }));
};

export const generateFakeInspections = (count = 10) => {
  return Array.from({ length: count }).map((_, index) => ({
    inspectionId: index + 1,
    inspectionNumber: `INSP-${1000 + index}`,
    customerName: faker.company.name(),
    employeeName: faker.person.fullName(),
    dateOfInspection: faker.date.recent().toISOString(),
    status: faker.number.int({ min: 0, max: 2 }),
    statusInspection: faker.number.int({ min: 0, max: 2 }),
    templateInspectionId: faker.number.int({ min: 1, max: 5 }),
  }));
};

export const generateFakeCustomers = (count = 10) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
  }));
};

export const generateFakeEmployees = (count = 10) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  }));
};

export const generateFakeUsers = (count = 10) => {
  return Array.from({ length: count }).map((_, index) => ({
    userId: index + 1,
    employeeId: faker.string.uuid(),
    employeeName: faker.person.fullName(),
    userName: faker.internet.username(),
    rol: faker.number.int({ min: 1, max: 2 }),
    status: faker.number.int({ min: 0, max: 1 }),
  }));
};

export const generateSingleWorkOrder = (id: number) => {
  return {
    workOrderId: id,
    customerId: faker.string.uuid(),
    employeeId: faker.string.uuid(),
    locationOfRepair: faker.location.streetAddress(),
    timeStart: faker.date.recent().toISOString(),
    equipament: faker.vehicle.vehicle(),
    dateOfRepair: faker.date.recent().toISOString(),
    timeFinish: faker.date.recent().toISOString(),
    licencePlate: faker.vehicle.vrm(),
    po: `PO-${faker.number.int({ min: 1000, max: 9999 })}`,
    vin: faker.vehicle.vin(),
    observation: faker.lorem.paragraph(),
    rif: faker.number.int({ min: 10, max: 100 }).toString(),
    rof: faker.number.int({ min: 10, max: 100 }).toString(),
    rir: faker.number.int({ min: 10, max: 100 }).toString(),
    ror: faker.number.int({ min: 10, max: 100 }).toString(),
    lif: faker.number.int({ min: 10, max: 100 }).toString(),
    lof: faker.number.int({ min: 10, max: 100 }).toString(),
    lir: faker.number.int({ min: 10, max: 100 }).toString(),
    lor: faker.number.int({ min: 10, max: 100 }).toString(),
    cif: faker.number.int({ min: 10, max: 100 }).toString(),
    cof: faker.number.int({ min: 10, max: 100 }).toString(),
    cir: faker.number.int({ min: 10, max: 100 }).toString(),
    cor: faker.number.int({ min: 10, max: 100 }).toString(),
    statusWorkOrder: 1, // para permitir visualización o edición
    workOrderDetails: Array.from({ length: 3 }).map(() => ({
      observation: faker.lorem.sentence(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      itemId: faker.number.int({ min: 1, max: 100 }),
    })),
    workOrderPhotos: Array.from({ length: 2 }).map(() => ({
      name: "mock-photo.jpg",
    })),
  };
};

export const generateSingleInspection = (id: number) => {
  return {
    inspectionId: id,
    customerId: faker.string.uuid(),
    employeeId: faker.string.uuid(),
    truckNumber: faker.vehicle.vrm(),
    vinNumber: faker.vehicle.vin(),
    po: `PO-${faker.number.int({ min: 1000, max: 9999 })}`,
    statusInspection: 1,
    signature: "mock-signature.png",
    questionAnswerList: Array.from({ length: 5 }).map(() => ({
      questionId: faker.number.int({ min: 1, max: 10 }),
      typeQuestion: faker.number.int({ min: 1, max: 4 }), // Varios tipos
      comment: faker.lorem.sentence(),
      answer: faker.helpers.arrayElement(["1", "0"]), // Ej. boolean o ID de opcion
      typeInspectionQuestionId: faker.number.int({ min: 1, max: 10 }),
      multimedia: [],
      options: [],
    })),
  };
};

export const generateSingleTypeInspection = (id: number) => {
  return {
    typeInspectionId: id,
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    status: 1,
    templateInspectionId: faker.number.int({ min: 1, max: 5 }),
    groups: [], // Fake groups if needed
    questions: Array.from({ length: 3 }).map(() => ({
      questionId: faker.number.int({ min: 1, max: 9999 }),
      name: faker.lorem.words(3) + "?",
      typeQuestion: faker.number.int({ min: 1, max: 3 }),
      required: faker.datatype.boolean(),
      status: 1,
      options: [
        { name: "Opción A", status: 1 },
        { name: "Opción B", status: 1 }
      ]
    }))
  };
};

export const getMockResponseFor = (url: string = "") => {
  // --- ENDPOINTS POR ID ---

  if (url.includes("/WorkOrder/GetWorkOrderById")) {
    const match = url.match(/WorkOrderId=(\d+)/);
    const id = match ? parseInt(match[1]) : 1;
    return generateSingleWorkOrder(id);
  }

  if (url.includes("/Inspection/GetInspectionById")) {
    const match = url.match(/InspectionId=(\d+)/);
    const id = match ? parseInt(match[1]) : 1;
    return generateSingleInspection(id);
  }

  if (url.includes("/TypeInspection/GetTypeInspectionId")) {
    const match = url.match(/TypeInspectionId=(\d+)/);
    const id = match ? parseInt(match[1]) : 1;
    return generateSingleTypeInspection(id);
  }

  if (url.includes("/User/GetUserId")) {
    return {
      userId: 1,
      employeeId: faker.string.uuid(),
      userName: faker.internet.username(),
      rol: faker.number.int({ min: 1, max: 2 }),
      status: 1,
      groups: []
    };
  }

  if (url.includes("/Group/GetGroupId")) {
    return {
      groupId: 1,
      name: faker.commerce.department(),
      status: 1,
      groupModules: [
        { moduleId: 1, add: true, update: true, read: true, delete: true }
      ]
    };
  }

  // --- DEPENDENCIAS DE QUICKBOOKS POR ID ---

  if (url.includes("/QuickBooks/Customers/GetCustomerId")) {
    return { id: faker.string.uuid(), name: faker.company.name() };
  }

  if (url.includes("/QuickBooks/Employees/GetEmployeeId")) {
    return { id: faker.string.uuid(), name: faker.person.fullName() };
  }

  if (url.includes("/QuickBooks/Items/GetItemId")) {
    return { id: faker.number.int({ min: 1, max: 100 }), name: faker.commerce.product() };
  }

  if (url.includes("/QuickBooks/Items/GetItemName")) {
    return Array.from({ length: 5 }).map(() => ({
      id: faker.number.int({ min: 1, max: 100 }), 
      name: faker.commerce.product()
    }));
  }

  // --- ENDPOINTS DE LISTAS Y OTROS ---

  if (url.includes("/TemplateInspection")) {
    return {
      items: [
        { templateInspectionId: 1, name: "Inspección Default" },
        { templateInspectionId: 2, name: "Liftgate Inspection" }
      ]
    };
  }

  if (url.includes("/WorkOrder")) {
    return {
      items: generateFakeWorkOrders(10),
      totalCount: 150,
      pageNumber: 1,
      totalPages: 15,
      hasPreviousPage: false,
      hasNextPage: true,
    };
  }

  if (url.includes("/Inspection")) {
    return {
      items: generateFakeInspections(10),
      totalCount: 80,
      pageNumber: 1,
      totalPages: 8,
    };
  }
  
  if (url.includes("/TypeInspection")) {
    return {
      items: Array.from({ length: 10 }).map((_, index) => ({
        typeInspectionId: index + 1,
        name: faker.commerce.productName(),
        status: 1
      })),
      totalCount: 30,
    };
  }

  if (url.includes("Customers/GetCustomerName")) {
    return generateFakeCustomers(5);
  }

  if (url.includes("employees/GetEmployeeName")) {
    return generateFakeEmployees(5);
  }

  if (url.includes("/User")) {
    return {
      items: generateFakeUsers(10),
      totalCount: 30,
    };
  }
  
  if (url.includes("/Group")) {
    return {
      items: Array.from({ length: 5 }).map((_, index) => ({
        groupId: index + 1,
        name: faker.commerce.department(),
        status: 1
      })),
      totalCount: 5,
    };
  }

  // Fallback genérico seguro
  return {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    totalPages: 1,
  };
};
