import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAdmin from "@/hooks/useAdmin";
import QuestionCard from "@/components/QuestionCard";
import withAdminAuth from "@/hoc/withAdminAuth";

const AdminDashboard = () => {
  const { pendingQuestions, handleApprove, handleReject } = useAdmin();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        {pendingQuestions.map((question) => (
          <Card key={question._id}>
            <QuestionCard
              question={question}
              className="outline-none border-none"
              showStatus={true}
            />
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
