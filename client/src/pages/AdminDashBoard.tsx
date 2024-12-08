import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAdmin from "@/hooks/useAdmin";
import withAdminAuth from "@/hoc/withAdminAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const AdminDashboard = () => {
  const { pendingQuestions, handleApprove, handleReject } = useAdmin();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        {pendingQuestions.map((question) => (
          <Card key={question._id}>
            <div className="flex justify-between items-center px-6 py-2">
              <CardTitle>{question.title}</CardTitle>
              <div>
                <div
                  className={cn(
                    "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
                    question.isApproved ? `bg-green-500` : `bg-red-500`
                  )}
                >
                  {question.isApproved ? "Approved" : "Pending"}
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDate(question.createdAt)}
                </p>
              </div>
            </div>
            <CardContent>
              <p>{question.content}</p>
              <div className="mt-2 space-x-2">
                {question.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {!question.isApproved && (
                <Button
                  onClick={() => handleApprove(question._id)}
                  className="mr-2"
                >
                  Approve
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => handleReject(question._id)}
              >
                {question.isApproved ? "Delete" : "Reject"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
