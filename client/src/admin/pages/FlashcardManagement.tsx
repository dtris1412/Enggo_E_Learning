import React, { useEffect, useState } from "react";
import { useFlashcard } from "../contexts/flashcardContext";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  BookOpen,
} from "lucide-react";
import AddFlashcardSetModal from "../components/FlashcardManagement/AddFlashcardSetModal";
import EditFlashcardSetModal from "../components/FlashcardManagement/EditFlashcardSetModal.tsx";
import FlashcardListModal from "../components/FlashcardManagement/FlashcardListModal";
import { useToast } from "../../shared/components/Toast/Toast";

const FlashcardManagement: React.FC = () => {
  const {
    flashcardSets,
    totalFlashcardSets,
    loading,
    error,
    fetchFlashcardSetsPaginated,
    deleteFlashcardSet,
  } = useFlashcard();

  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [createdByTypeFilter, setCreatedByTypeFilter] = useState("");

  useEffect(() => {
    fetchFlashcardSetsPaginated(
      searchTerm,
      currentPage,
      itemsPerPage,
      visibilityFilter,
      createdByTypeFilter,
    );
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    visibilityFilter,
    createdByTypeFilter,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFlashcardSetsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      visibilityFilter,
      createdByTypeFilter,
    );
  };

  const handleEdit = (set: any) => {
    setSelectedSet(set);
    setIsEditModalOpen(true);
  };

  const handleViewFlashcards = (set: any) => {
    setSelectedSet(set);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (flashcard_set_id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this flashcard set? All flashcards in this set will also be deleted.",
      )
    ) {
      const success = await deleteFlashcardSet(flashcard_set_id);
      if (success) {
        showToast("success", "Flashcard set deleted successfully");
        fetchFlashcardSetsPaginated(
          searchTerm,
          currentPage,
          itemsPerPage,
          visibilityFilter,
          createdByTypeFilter,
        );
      } else {
        showToast("error", "Failed to delete flashcard set");
      }
    }
  };

  const totalPages = Math.ceil(totalFlashcardSets / itemsPerPage);

  const getVisibilityBadge = (visibility: string) => {
    const colors = {
      public: "bg-green-100 text-green-800",
      private: "bg-red-100 text-red-800",
      shared: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          colors[visibility as keyof typeof colors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {visibility}
      </span>
    );
  };

  const getCreatedByBadge = (createdByType: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
      AI: "bg-orange-100 text-orange-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          colors[createdByType as keyof typeof colors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {createdByType}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Flashcard Management
        </h1>
        <p className="text-gray-600">
          Manage and organize your flashcard sets and cards
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search flashcard sets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Visibility Filter */}
            <div className="w-full md:w-48">
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            {/* Created By Filter */}
            <div className="w-full md:w-48">
              <select
                value={createdByTypeFilter}
                onChange={(e) => setCreatedByTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="AI">AI</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Set
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Flashcard Sets List */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cards
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flashcardSets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BookOpen className="w-12 h-12 mb-2 text-gray-400" />
                        <p className="text-lg font-medium">
                          No flashcard sets found
                        </p>
                        <p className="text-sm">
                          Create your first flashcard set to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  flashcardSets.map((set) => (
                    <tr key={set.flashcard_set_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{set.flashcard_set_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{set.title}</div>
                        {set.source_type && (
                          <div className="text-xs text-gray-500">
                            Source: {set.source_type}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {set.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {set.total_cards} cards
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getVisibilityBadge(set.visibility)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCreatedByBadge(set.created_by_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewFlashcards(set)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Flashcards"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(set)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit Set"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(set.flashcard_set_id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Set"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalFlashcardSets)} of{" "}
                {totalFlashcardSets} flashcard sets
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddFlashcardSetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchFlashcardSetsPaginated(
            searchTerm,
            currentPage,
            itemsPerPage,
            visibilityFilter,
            createdByTypeFilter,
          );
        }}
      />

      {selectedSet && (
        <>
          <EditFlashcardSetModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSet(null);
            }}
            flashcardSet={selectedSet}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedSet(null);
              fetchFlashcardSetsPaginated(
                searchTerm,
                currentPage,
                itemsPerPage,
                visibilityFilter,
                createdByTypeFilter,
              );
            }}
          />

          <FlashcardListModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedSet(null);
            }}
            flashcardSet={selectedSet}
            onUpdate={() => {
              fetchFlashcardSetsPaginated(
                searchTerm,
                currentPage,
                itemsPerPage,
                visibilityFilter,
                createdByTypeFilter,
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default FlashcardManagement;
