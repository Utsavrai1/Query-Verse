import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import QuestionCard from "@/components/QuestionCard";
import { MultiSelect } from "@/components/MultiSelect";
import { useApprovedQuestion } from "@/hooks/useApprovedQuestion";
import { Question } from "@/types";
import Loader from "@/components/Loader";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { totalPages, questions, getApprovedQuestion, loading, getTags, tags } =
    useApprovedQuestion();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      await getApprovedQuestion(currentPage, 4, searchText, selectedTags);
    };
    const fetchTag = async () => {
      await getTags();
    };

    fetchTag();
    fetchQuestions();
  }, [currentPage]);

  const handleSearch = async () => {
    setCurrentPage(1);
    await getApprovedQuestion(1, 4, searchText, selectedTags);
  };

  const handleCardClick = (question: Question) => {
    navigate(`/q/${question._id}`, { state: { question } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <Input
          placeholder="Search questions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-1/2"
        />
        <MultiSelect
          options={tags}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder="Filter by tags"
        />
        <Button onClick={handleSearch} className="bg-blue-500 text-white">
          Search
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question._id} onClick={() => handleCardClick(question)}>
            <QuestionCard question={question} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Home;
