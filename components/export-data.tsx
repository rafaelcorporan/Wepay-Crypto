"use client"

import { useState } from "react"
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExportDataProps {
  onBack: () => void
}

export function ExportData({ onBack }: ExportDataProps) {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [exportType, setExportType] = useState("")
  const [format, setFormat] = useState("")

  const handleExport = () => {
    alert(`Exporting ${exportType} data in ${format} format...`)
  }

  const exportOptions = [
    { value: "transactions", label: "Transaction History" },
    { value: "balances", label: "Wallet Balances" },
    { value: "addresses", label: "Address Book" },
    { value: "all", label: "Complete Wallet Data" },
  ]

  const formatOptions = [
    { value: "csv", label: "CSV (Comma Separated)" },
    { value: "json", label: "JSON (JavaScript Object)" },
    { value: "pdf", label: "PDF (Portable Document)" },
    { value: "xlsx", label: "Excel (Spreadsheet)" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="bg-[#222426] border-[#2D2D2D] text-gray-300 hover:bg-[#2D2D2D]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-wider">EXPORT DATA</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6">
          <h2 className="text-lg font-semibold mb-6 tracking-wide">EXPORT CONFIGURATION</h2>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">DATA TYPE</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-[#1a1c1d] border-[#2D2D2D] text-white">
                  <SelectValue placeholder="Select data to export" />
                </SelectTrigger>
                <SelectContent className="bg-[#222426] border-[#2D2D2D]">
                  {exportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-[#2D2D2D]">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">FILE FORMAT</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-[#1a1c1d] border-[#2D2D2D] text-white">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent className="bg-[#222426] border-[#2D2D2D]">
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-[#2D2D2D]">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom" className="text-sm font-medium text-gray-300 mb-2 block">
                  FROM DATE
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-[#1a1c1d] border-[#2D2D2D] text-white"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm font-medium text-gray-300 mb-2 block">
                  TO DATE
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-[#1a1c1d] border-[#2D2D2D] text-white"
                />
              </div>
            </div>

            <div className="bg-[#1a1c1d] rounded border border-[#2D2D2D] p-4">
              <div className="flex items-center gap-2 text-[#FF6600] mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">EXPORT PREVIEW</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Type:</span>
                  <span className="text-white">{exportType || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-white">{format || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date Range:</span>
                  <span className="text-white">{dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : "All dates"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Size:</span>
                  <span className="text-white">~2.4 MB</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={!exportType || !format}
              className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-3 font-medium tracking-wide"
            >
              <Download className="w-4 h-4 mr-2" />
              EXPORT DATA
            </Button>
          </div>
        </div>

        <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6">
          <h2 className="text-lg font-semibold mb-6 tracking-wide">RECENT EXPORTS</h2>

          <div className="space-y-4">
            {[
              {
                name: "transaction_history_2025_01.csv",
                type: "Transaction History",
                date: "2025-01-07",
                size: "1.2 MB",
              },
              {
                name: "wallet_balances_2025_01.json",
                type: "Wallet Balances",
                date: "2025-01-05",
                size: "45 KB",
              },
              {
                name: "complete_backup_2024_12.xlsx",
                type: "Complete Backup",
                date: "2024-12-31",
                size: "5.7 MB",
              },
            ].map((export_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#1a1c1d] rounded border border-[#2D2D2D]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF6600]" />
                  <div>
                    <div className="font-medium text-sm">{export_.name}</div>
                    <div className="text-xs text-gray-400">{export_.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">{export_.size}</div>
                  <div className="text-xs text-gray-400">{export_.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#1a1c1d] rounded border border-[#2D2D2D]">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">EXPORT GUIDELINES</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Exports are encrypted and password protected</li>
              <li>• Files are automatically deleted after 30 days</li>
              <li>• Maximum export size is 100 MB</li>
              <li>• Personal data is anonymized in exports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
