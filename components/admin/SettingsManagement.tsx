"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Users, Shield, Bell, Save } from "lucide-react";
import { toast } from "sonner";

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    siteTitle: "MyBlog",
    siteDescription: "A modern blogging platform for writers and readers.",
    adminEmail: "admin@myblog.com",
    allowRegistration: true,
    moderateComments: true,
    enableNewsletter: true,
    featuredCategories: "Technology, Design, Business",
    defaultUserRole: "reader",
    timezone: "UTC",
    language: "en",
    analyticsEnabled: true,
    backupFrequency: "weekly",
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        } else {
          toast.error('Failed to load settings');
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Blog settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Platform Settings</h2>
          <p className="text-muted-foreground">
            Configure your blog platform
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-coral-500 hover:bg-coral-600">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User & Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User & Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable new user signups
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Moderate Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Require approval for comments
                </p>
              </div>
              <Switch
                checked={settings.moderateComments}
                onCheckedChange={(checked) => setSettings({ ...settings, moderateComments: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to subscribe to your newsletter
                </p>
              </div>
              <Switch
                checked={settings.enableNewsletter}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNewsletter: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredCategories">Featured Categories</Label>
              <Input
                id="featuredCategories"
                value={settings.featuredCategories}
                onChange={(e) => setSettings({ ...settings, featuredCategories: e.target.value })}
                placeholder="e.g. Technology, Design, Business"
              />
            </div>
            <div className="space-y-2">
              <Label>Default User Role</Label>
              <Select
                value={settings.defaultUserRole}
                onValueChange={(value) => setSettings({ ...settings, defaultUserRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        
      </div>
    </div>
  );
};

export default SettingsManagement; 