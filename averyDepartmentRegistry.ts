export const DEFAULT_AVERY_DEPARTMENTS = [
  "Executive",
  "Creator Logistics",
  "ATLAS Systems",
  "AveryTech",
  "Marketing",
  "Sales",
  "Philanthropy",
  "Entertainment",
  "Real Estate",
  "Academy",
];

const departments: any[] = [];

export function seedAveryDepartments() {
  if (departments.length) return departments;
  DEFAULT_AVERY_DEPARTMENTS.forEach((departmentName, index) => {
    departments.push({
      id: `department-${index + 1}`,
      departmentName,
      status: "Active",
      manager: departmentName === "Executive" ? "ATLAS Prime" : "Unassigned",
      purpose: defaultPurpose(departmentName),
    });
  });
  return departments;
}

export function createDepartmentRecord(department: any) {
  const stored = { ...department, id: department.id || `department-${departments.length + 1}`, status: department.status || "Active" };
  departments.push(stored);
  return stored;
}

export function getDepartments() {
  seedAveryDepartments();
  return departments.slice();
}

export function getDepartmentByName(departmentName: string) {
  seedAveryDepartments();
  const department = departments.find((item) => item.departmentName === departmentName);
  if (!department) throw new Error(`Department ${departmentName} not found.`);
  return department;
}

function defaultPurpose(departmentName: string): string {
  const purposes: Record<string, string> = {
    Executive: "Company command, decisions, priorities, and approvals.",
    "Creator Logistics": "Revenue through creator services, fulfillment, clients, and editors.",
    "ATLAS Systems": "Internal operating system, agents, memory, approvals, and automation.",
    AveryTech: "Accessibility tools, ATLAS Assist, EchoFrame, and product research.",
    Marketing: "Content, campaigns, audience, and brand growth.",
    Sales: "Leads, proposals, follow-ups, and revenue pipeline.",
    Philanthropy: "Grants, donors, nonprofits, and mission funding.",
    Entertainment: "Media, games, IP, and creative experiments.",
    "Real Estate": "Future HQ, facilities, studios, labs, and property planning.",
    Academy: "Training, internal education, SOPs, and future public learning.",
  };
  return purposes[departmentName] || "Department purpose pending.";
}
