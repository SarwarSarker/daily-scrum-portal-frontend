import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatarGroup } from "@/components/common/UserAvatarGroup";
import { EmptyState } from "@/components/common/EmptyState";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { projectToDefaults } from "@/components/projects/projectToDefaults";
import { RadialChart } from "@/components/charts/RadialChart";
import { useProject, useUsers, useProjectTasks } from "@/utils/apiHelper";
import { getInitials } from "@/lib/utils";
import { ProjectStat } from "@/components/projectDetails/ProjectStat";
import { ProjectTaskCard } from "@/components/projectDetails/ProjectTaskCard";
import { getProgressColor } from "@/components/projectDetails/projectDetailsHelpers";

export function ProjectDetailsPage() {
  // The project id comes from the URL, e.g. /projects/123
  const { id } = useParams<{ id: string }>();

  // Controls whether the "Edit project" modal is open.
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useProject(id ?? "");
  console.log("🚀 ~ ProjectDetailsPage ~ project:", project);
  const { data: users = [] } = useUsers();
  const { data: projectTasks = [], isLoading: isLoadingTasks } =
    useProjectTasks(id ?? "");

  const projectOwner = project?.owner;
  const projectTeammates = project?.members ?? [];

  // While any of the data is still loading, show a simple loader.
  if (isLoadingProject || isLoadingTasks) {
    return (
      <div className="space-y-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2"
          disabled
        >
          <Link to="/projects">
            <ArrowLeft className="size-4" /> Back to projects
          </Link>
        </Button>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">
            Loading project details...
          </div>
        </div>
      </div>
    );
  }

  // If the project failed to load (or doesn't exist), show a friendly message.
  if (projectError || !project) {
    return (
      <Card className="p-10">
        <EmptyState
          title="Project not found"
          description="It may have been deleted or you may not have access."
          action={
            <Button asChild variant="outline">
              <Link to="/projects">
                <ArrowLeft /> Back to projects
              </Link>
            </Button>
          }
        />
      </Card>
    );
  }

  const progressColor = getProgressColor(
    project.progress ?? 0,
    project.targetProgress ?? 100,
  );

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to="/projects">
            <ArrowLeft className="size-4" /> Back to projects
          </Link>
        </Button>

        <Button variant="gradient" onClick={() => setIsEditModalOpen(true)}>
          <Edit3 /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main column: status card + tabs */}
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <div className="text-2xl font-bold">{project.name}</div>
                <div className="text-sm text-muted-foreground">
                  {project.description}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={project.status} kind="project" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <ProjectStat
                      icon={Target}
                      label="Tasks"
                      value={`${project.taskStats?.completed ?? 0}/${project.taskStats?.total ?? 0}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <RadialChart
                    value={project.progress ?? 0}
                    label={`${project.progress ?? 0}%`}
                    sublabel="Complete"
                    color={progressColor}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="scrum">Scrum history</TabsTrigger>
              <TabsTrigger value="tasks">
                Tasks ({projectTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scrum">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-2">
                {projectTasks.length === 0 ? (
                  <EmptyState
                    title="No tasks yet"
                    description="Tasks added to this project will appear here."
                  />
                ) : (
                  projectTasks.map((task) => (
                    <ProjectTaskCard key={task.id} task={task} users={users} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: owner/team + meta */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner & team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectOwner && (
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {projectOwner.avatar && (
                      <AvatarImage
                        src={projectOwner.avatar}
                        alt={projectOwner.name}
                      />
                    )}
                    <AvatarFallback>
                      {getInitials(projectOwner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{projectOwner.name}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Owner
                  </span>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Team ({projectTeammates.length})
                </p>
                <UserAvatarGroup users={projectTeammates} max={6} size="md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectFormModal
        open={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(false)}
        defaultValues={projectToDefaults(project)}
      />
    </>
  );
}
