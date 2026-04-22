const DashboardPage = ({ role }: { role: string }) => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#0c0c12" }}>
    <div className="text-center">
      <h1 className="text-3xl font-bold font-heading text-foreground mb-2 capitalize">{role} Dashboard</h1>
      <p className="text-muted-foreground font-body">Welcome to the {role} panel.</p>
    </div>
  </div>
);

export default DashboardPage;
