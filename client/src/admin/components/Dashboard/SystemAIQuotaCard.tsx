import { useEffect, useState } from "react";
import { useSystemAIQuota } from "../../contexts/systemAIQuotaContext";
import {
  Zap,
  TrendingUp,
  DollarSign,
  Database,
  Settings,
  AlertCircle,
  PlusCircle,
  X,
} from "lucide-react";

const SystemAIQuotaCard = () => {
  const { stats, loading, error, fetchStats, updateCredit } =
    useSystemAIQuota();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSubmitError("");
    setSubmitSuccess(false);
    setCreditAmount("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreditAmount("");
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const handleSubmitCredit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credit = parseFloat(creditAmount);
    if (isNaN(credit) || credit <= 0) {
      setSubmitError("Please enter a valid positive number");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await updateCredit({ credit });
      setSubmitSuccess(true);
      setCreditAmount("");
      setTimeout(() => {
        handleCloseModal();
        fetchStats();
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update credit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const aiTokenUsagePercent = stats?.aiTokens.usagePercent || 0;
  const creditUsagePercent = stats?.credit.usagePercent || 0;
  const creditRemaining = parseFloat(stats?.credit.remaining || "0");
  const creditTotal = stats?.credit.total || 0;
  const creditUsed = parseFloat(stats?.credit.used || "0");

  // Determine status color
  const getStatusColor = (percent: number) => {
    if (percent >= 80) return "text-red-600";
    if (percent >= 60) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-red-500";
    if (percent >= 60) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md border border-blue-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">AI Quota System</h3>
            <p className="text-sm text-gray-600">Credit & Token Management</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="font-medium">Add Credit</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Credit */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              Credit Remaining
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${creditRemaining.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            of ${creditTotal.toFixed(2)} total (${creditUsed.toFixed(2)} used)
          </div>
        </div>

        {/* AI Tokens */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">AI Tokens</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats?.aiTokens.remaining.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            of {stats?.aiTokens.total.toLocaleString() || 0} available
          </div>
        </div>

        {/* Usage */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Credit Usage
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${getStatusColor(creditUsagePercent)}`}
          >
            {creditUsagePercent.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {aiTokenUsagePercent.toFixed(1)}% tokens used
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Credit Usage</span>
          <span className={`font-bold ${getStatusColor(creditUsagePercent)}`}>
            {creditUsagePercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(creditUsagePercent)} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(creditUsagePercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Config Info */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            Configuration
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Price/Million</div>
            <div className="font-semibold text-gray-800">
              ${stats?.config.pricePerMillion || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Buffer</div>
            <div className="font-semibold text-gray-800">
              {stats?.config.bufferPercent || 0}%
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Token Unit</div>
            <div className="font-semibold text-gray-800">
              {stats?.config.aiTokenUnit || 0}
            </div>
          </div>
        </div>
      </div>

      {/* OpenAI Tokens Info (collapsed) */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
          OpenAI Tokens Details
        </summary>
        <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total OpenAI Tokens:</span>
            <span className="font-semibold text-gray-800">
              {stats?.openAITokens.total.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Buffer Tokens:</span>
            <span className="font-semibold text-gray-800">
              {stats?.openAITokens.buffer.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Available Tokens:</span>
            <span className="font-semibold text-gray-800">
              {stats?.openAITokens.available.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-semibold text-green-600">
              {stats?.openAITokens.remaining.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Used:</span>
            <span className="font-semibold text-red-600">
              {stats?.openAITokens.used.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </details>

      {/* Add Credit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Add OpenAI Credit
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitCredit} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="creditAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Credit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="creditAmount"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter the amount of credit you added to your OpenAI account
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✓ Credit updated successfully!
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {/* Calculation Preview */}
              {creditAmount && parseFloat(creditAmount) > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <div className="font-semibold text-blue-900 mb-2">
                    Estimated Allocation:
                  </div>
                  <div className="space-y-1 text-blue-800">
                    <div className="flex justify-between">
                      <span>Credit:</span>
                      <span className="font-medium">
                        ${parseFloat(creditAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>OpenAI Tokens:</span>
                      <span className="font-medium">
                        {(
                          (parseFloat(creditAmount) /
                            (stats?.config.pricePerMillion || 0.75)) *
                          1000000
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        After Buffer ({stats?.config.bufferPercent || 40}%):
                      </span>
                      <span className="font-medium">
                        {(
                          (parseFloat(creditAmount) /
                            (stats?.config.pricePerMillion || 0.75)) *
                          1000000 *
                          (1 - (stats?.config.bufferPercent || 40) / 100)
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-blue-300 pt-1 mt-1">
                      <span className="font-semibold">AI Tokens:</span>
                      <span className="font-bold">
                        {(
                          ((parseFloat(creditAmount) /
                            (stats?.config.pricePerMillion || 0.75)) *
                            1000000 *
                            (1 - (stats?.config.bufferPercent || 40) / 100)) /
                          (stats?.config.aiTokenUnit || 500)
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Credit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAIQuotaCard;
