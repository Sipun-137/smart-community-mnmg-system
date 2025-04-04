// Demo user data
// const demoUser = {
//   name: "John Doe",
//   email: "john.doe@example.com",
//   password: "********",
//   role: "Resident",
//   apartmentNo: "A-101",
//   phone: "+1 (555) 123-4567",
// };

import ProfilePage from "@/components/Profile-Card";

export default function Page() {
  return (
    <div className="container  py-10">
      <div className="space-y-8">
        <ProfilePage />
        <div className="grid gap-8 md:grid-cols-2"></div>
      </div>
    </div>
  );
}
