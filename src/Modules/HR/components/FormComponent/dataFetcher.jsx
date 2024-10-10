export const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const headers = [
        "Form Id",
        "User",
        "Designation",
        "Date",
        "View",
        "Track",
      ];
      const formData = [
        {
          formId: "101202",
          user: "Atul Gupta",
          designation: "Professor",
          date: "12 October 2024",
        },
        {
          formId: "101203",
          user: "Atul Gupta",
          designation: "Professor",
          date: "29 October 2024",
        },
      ];
      resolve({ headers, formData });
    }, 100);
  });
};
