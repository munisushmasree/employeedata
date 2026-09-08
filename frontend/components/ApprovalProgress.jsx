export default function ApprovalProgress() {
  const approvals = [
    {
      department: "HR",
      status: "Pending",
    },
    {
      department: "IT",
      status: "Pending",
    },
    {
      department: "Finance",
      status: "Pending",
    },
    {
      department: "Manager",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-4">

      {approvals.map((approval) => (
        <div
          key={approval.department}
          className="flex justify-between border p-4 rounded-lg"
        >

          <span className="font-medium">
            {approval.department} Clearance
          </span>

          <span>
            {approval.status}
          </span>

        </div>
      ))}

    </div>
  );
}