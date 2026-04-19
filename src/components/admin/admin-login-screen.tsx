import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminLoginHeroPanel } from "@/components/admin/admin-login-hero-panel";

export function AdminLoginScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] px-6 py-12 sm:px-8 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,35,37,0.08),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(23,20,26,0.08),transparent_20%),linear-gradient(180deg,#fbfcff_0%,#f3f5fa_100%)]" />
      <div className="absolute left-[-10rem] top-[-6rem] h-72 w-72 rounded-full bg-[rgba(237,35,37,0.08)] blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(23,20,26,0.08)] blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_24px_60px_rgba(35,31,32,0.08)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <AdminLoginHeroPanel />

          <div className="relative bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="mx-auto flex min-h-full max-w-lg items-center">
              <div className="w-full rounded-[1.5rem] border border-[#e7e9f2] bg-[#ffffff] p-6 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-7">
                <AdminLoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
