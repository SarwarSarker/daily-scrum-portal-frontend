import { Bell, Palette, ShieldCheck, User as UserIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { AppearanceSettings } from '@/components/settings/AppearanceSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'

export function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, notifications, appearance, and security."
      />

      <Tabs defaultValue="profile">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="profile" className="gap-2"><UserIcon className="size-4" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="size-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="size-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><ShieldCheck className="size-4" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><ProfileSettings /></TabsContent>
        <TabsContent value="notifications"><NotificationSettings /></TabsContent>
        <TabsContent value="appearance"><AppearanceSettings /></TabsContent>
        <TabsContent value="security"><SecuritySettings /></TabsContent>
      </Tabs>
    </>
  )
}
