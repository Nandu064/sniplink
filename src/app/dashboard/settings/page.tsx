"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { showSuccess, showError, confirmDelete } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  createdAt: string;
}

function UpgradeSuccessHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      showSuccess("You're now on Pro! Welcome to Sniplink Pro.");
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);
  return null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Billing
  const [billingLoading, setBillingLoading] = useState(false);

  // Profile form
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Link-in-Bio form
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user");
        if (res.status === 401) {
          router.push("/signin");
          return;
        }
        const data = await res.json();
        setUser(data);
        setName(data.name);

        // Fetch bio profile
        const bioRes = await fetch("/api/user/profile");
        if (bioRes.ok) {
          const bioData = await bioRes.json();
          setUsername(bioData.username ?? "");
          setDisplayName(bioData.displayName ?? "");
          setBio(bioData.bio ?? "");
        }
      } catch {
        showError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleUpgrade = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showError(data.error || "Failed to start checkout");
        setBillingLoading(false);
      }
    } catch {
      showError("Something went wrong");
      setBillingLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showError(data.error || "Failed to open billing portal");
        setBillingLoading(false);
      }
    } catch {
      showError("Something went wrong");
      setBillingLoading(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      showError("Name must be at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        showError(data.error || "Failed to update profile");
        return;
      }

      const data = await res.json();
      setUser(data);
      showSuccess("Profile updated!");
    } catch {
      showError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBio = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername && !/^[a-z0-9_-]{3,30}$/.test(trimmedUsername)) {
      showError(
        "Username must be 3–30 characters: letters, numbers, underscores, or hyphens only"
      );
      return;
    }

    setSavingBio(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername || null,
          displayName: displayName.trim() || null,
          bio: bio.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Failed to save Link-in-Bio settings");
        return;
      }

      setUsername(data.username ?? "");
      setDisplayName(data.displayName ?? "");
      setBio(data.bio ?? "");
      showSuccess("Link-in-Bio settings saved!");
    } catch {
      showError("Something went wrong");
    } finally {
      setSavingBio(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Failed to change password");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess("Password changed successfully!");
    } catch {
      showError("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmDelete(
      "Delete your account?",
      "This will permanently delete your account, all your links, and all analytics data. This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) {
        showError("Failed to delete account");
        return;
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      showError("Something went wrong");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const isPro = user?.plan === "pro";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Suspense fallback={null}>
        <UpgradeSuccessHandler />
      </Suspense>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      {/* Billing Section */}
      <Card className={isPro ? "border-violet-200" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Billing
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isPro
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPro ? "Pro" : "Free"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {isPro ? (
                <>
                  <p className="text-sm font-medium text-slate-900">Sniplink Pro</p>
                  <p className="text-sm text-slate-500">
                    You have access to all Pro features. Manage or cancel anytime.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-900">Free Plan</p>
                  <p className="text-sm text-slate-500">
                    Upgrade to Pro for unlimited links, advanced analytics, AI slugs, and more.
                  </p>
                </>
              )}
            </div>
            {isPro ? (
              <Button
                onClick={handleManageSubscription}
                loading={billingLoading}
                variant="secondary"
                className="shrink-0"
              >
                Manage Subscription
              </Button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={billingLoading}
                className="shrink-0 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                {billingLoading ? "Redirecting…" : "Upgrade to Pro — $9/mo"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
            <Input
              label="Email"
              value={user?.email || ""}
              disabled
              helperText="Email cannot be changed"
            />
            <div className="text-xs text-slate-400">
              Member since {user?.createdAt ? formatDate(user.createdAt) : "--"}
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Link-in-Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Link-in-Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveBio} className="space-y-4">
            <div>
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="e.g. johndoe"
                helperText="Only letters, numbers, underscores, and hyphens (3–30 chars)"
              />
              {username.trim() && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Your bio page:{" "}
                  <a
                    href={`/u/${username.trim().toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline font-medium"
                  >
                    sniplink-green.vercel.app/u/{username.trim().toLowerCase()}
                  </a>
                </p>
              )}
            </div>
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your public display name"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a bit about yourself"
                maxLength={200}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">
                {bio.length}/200
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={savingBio}>
                Save Link-in-Bio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={changingPassword}>
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Delete Account</p>
              <p className="text-sm text-slate-500">
                Permanently delete your account, links, and all analytics data.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={deleting}
              className="shrink-0"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
