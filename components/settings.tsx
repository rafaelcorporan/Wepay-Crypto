"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileText, Calendar, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Contacts } from "@/components/contacts"
import { useTheme } from "next-themes"

export function Settings() {
  const [name, setName] = useState("Satoshi Nakamoto")
  const [email, setEmail] = useState("satoshi@wepay.com")
  const [password, setPassword] = useState("")
  const [twoFA, setTwoFA] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [notifications, setNotifications] = useState(true)
  const [kycActive, setKycActive] = useState(false)
  const [kycApproved, setKycApproved] = useState(false)

  // KYC Wizard State
  const [showKycModal, setShowKycModal] = useState(false)
  const [kycStep, setKycStep] = useState(0)
  const [kycStatus, setKycStatus] = useState<"pending"|"approved"|"rejected"|null>(null)
  const [kycInfo, setKycInfo] = useState({
    fullName: "",
    dob: "",
    address: "",
    idType: "passport",
    idFile: null as File|null,
    selfie: null as File|null,
  })
  const idFileInput = useRef<HTMLInputElement>(null)
  const selfieInput = useRef<HTMLInputElement>(null)

  // Export Data state (copied from ExportData)
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

  const { setTheme: setSystemTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto bg-[#222426] rounded-2xl border border-[#2D2D2D] shadow-lg p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>

      {/* Profile Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#FF6600]">Profile</h2>
        <div className="flex flex-col gap-2">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="bg-[#1a1c1d] border-[#2D2D2D] text-white" />
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="bg-[#1a1c1d] border-[#2D2D2D] text-white" />
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Change Password" className="bg-[#1a1c1d] border-[#2D2D2D] text-white" />
          <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white w-fit mt-2" onClick={() => {
            setSystemTheme(theme);
            alert('Profile saved!');
            setPassword("");
          }}>Save Profile</Button>
        </div>
      </section>

      {/* Security Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#FF6600]">Security</h2>
        <div className="flex items-center justify-between">
          <span className="text-white">Two-Factor Authentication</span>
          <Switch checked={twoFA} onCheckedChange={setTwoFA} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Session Management</span>
          <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white">View Sessions</Button>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#FF6600]">Preferences</h2>
        <div className="flex items-center justify-between">
          <span className="text-white">Theme</span>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-32 bg-[#1a1c1d] border-[#2D2D2D] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#222426] border-[#2D2D2D]">
              <SelectItem value="dark" className="text-white">Dark</SelectItem>
              <SelectItem value="light" className="text-black">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Notifications</span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </section>

      {/* Export/Import Data Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-[#FF6600]">Export / Import Data</h2>
        <Accordion type="multiple" className="w-full" defaultValue={[]}>
          <AccordionItem value="export-data">
            <AccordionTrigger>Export Data</AccordionTrigger>
            <AccordionContent>
              {/* EXPORT CONFIGURATION */}
              <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6">
                <h3 className="text-lg font-semibold mb-6 tracking-wide">Export Data</h3>
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
                      <Label htmlFor="dateFrom" className="text-sm font-medium text-gray-300 mb-2 block">FROM DATE</Label>
                      <Input id="dateFrom" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#1a1c1d] border-[#2D2D2D] text-white" />
                    </div>
                    <div>
                      <Label htmlFor="dateTo" className="text-sm font-medium text-gray-300 mb-2 block">TO DATE</Label>
                      <Input id="dateTo" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#1a1c1d] border-[#2D2D2D] text-white" />
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recent-exports">
            <AccordionTrigger>Recent Exports</AccordionTrigger>
            <AccordionContent>
              {/* RECENT EXPORTS */}
              <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6">
                <h3 className="text-lg font-semibold mb-6 tracking-wide">RECENT EXPORTS</h3>
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
                      className="flex flex-row items-start justify-between p-3 bg-[#1a1c1d] rounded border border-[#2D2D2D] gap-4"
                    >
                      {/* Left: File name and type */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate max-w-[12rem]" title={export_.name}>{export_.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[12rem]">{export_.type}</div>
                      </div>
                      {/* Right: File size and date */}
                      <div className="flex flex-col items-end min-w-0 text-right">
                        <div className="text-sm text-gray-300 truncate max-w-[4.5rem]" title={export_.size}>{export_.size}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[6rem]" title={export_.date}>{export_.date}</div>
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="contacts">
            <AccordionTrigger>Contacts</AccordionTrigger>
            <AccordionContent>
              <Contacts />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Import Data Button */}
        <div className="flex gap-2 mt-6">
          <Button className="bg-[#1a1c1d] text-white">Import Data</Button>
        </div>
      </section>

      {/* Wallet Activation (KYC) Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#FF6600]">Wallet Activation (KYC)</h2>
        <div className="flex items-center justify-between">
          <span className="text-white">Start KYC verification to enable bank connection</span>
          <Switch
            checked={kycActive}
            onCheckedChange={v => {
              setKycActive(v)
              if (!v) setKycApproved(false)
            }}
          />
        </div>
        {!kycActive && (
          <div className="text-xs text-red-400">Bank connection is disabled until KYC is completed.</div>
        )}
        {kycActive && !kycApproved && (
          <div className="space-y-2">
            <div className="text-xs text-yellow-400">KYC verification in progress. Bank connection is still disabled.</div>
            <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white text-xs py-1 px-3" onClick={() => { setShowKycModal(true); setKycStep(0); setKycStatus(null); }}>
              Start KYC process
            </Button>
          </div>
        )}
        {kycActive && kycApproved && (
          <div className="text-xs text-green-400">KYC approved. You can now connect your bank account.</div>
        )}
      </section>

      {/* Danger Zone Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
        <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
      </section>

      {/* KYC Modal Wizard */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-foreground"
              onClick={() => setShowKycModal(false)}
            >×</button>
            {/* KYC Steps */}
            {kycStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Start KYC Verification</h2>
                <p className="text-gray-300 text-sm">To activate your wallet and connect a bank, please complete KYC verification. This process is secure and required by law.</p>
                <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white w-full" onClick={() => setKycStep(1)}>Begin</Button>
              </div>
            )}
            {kycStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
                <Input className="bg-[#1a1c1d] border-[#2D2D2D] text-white" placeholder="Full Name" value={kycInfo.fullName} onChange={e => setKycInfo({ ...kycInfo, fullName: e.target.value })} />
                <Input className="bg-[#1a1c1d] border-[#2D2D2D] text-white" placeholder="Date of Birth (YYYY-MM-DD)" value={kycInfo.dob} onChange={e => setKycInfo({ ...kycInfo, dob: e.target.value })} />
                <Input className="bg-[#1a1c1d] border-[#2D2D2D] text-white" placeholder="Address" value={kycInfo.address} onChange={e => setKycInfo({ ...kycInfo, address: e.target.value })} />
                <div className="flex gap-2 justify-between">
                  <Button className="bg-[#1a1c1d] text-white flex-1" onClick={() => setKycStep(0)}>Back</Button>
                  <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white flex-1" onClick={() => setKycStep(2)} disabled={!kycInfo.fullName || !kycInfo.dob || !kycInfo.address}>Next</Button>
                </div>
              </div>
            )}
            {kycStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Upload Identity Document</h2>
                <select className="w-full p-2 rounded bg-[#1a1c1d] border border-[#2D2D2D] text-white" value={kycInfo.idType} onChange={e => setKycInfo({ ...kycInfo, idType: e.target.value })}>
                  <option value="passport">Passport</option>
                  <option value="driver">Driver&apos;s License</option>
                  <option value="id">National ID</option>
                </select>
                <input ref={idFileInput} type="file" accept="image/*,application/pdf" className="w-full text-xs text-gray-300" onChange={e => setKycInfo({ ...kycInfo, idFile: e.target.files?.[0] || null })} />
                <div className="flex gap-2 justify-between">
                  <Button className="bg-[#1a1c1d] text-white flex-1" onClick={() => setKycStep(1)}>Back</Button>
                  <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white flex-1" onClick={() => setKycStep(3)} disabled={!kycInfo.idFile}>Next</Button>
                </div>
              </div>
            )}
            {kycStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Selfie Verification</h2>
                <input ref={selfieInput} type="file" accept="image/*" className="w-full text-xs text-gray-300" onChange={e => setKycInfo({ ...kycInfo, selfie: e.target.files?.[0] || null })} />
                <div className="flex gap-2 justify-between">
                  <Button className="bg-[#1a1c1d] text-white flex-1" onClick={() => setKycStep(2)}>Back</Button>
                  <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white flex-1" onClick={() => setKycStep(4)} disabled={!kycInfo.selfie}>Next</Button>
                </div>
              </div>
            )}
            {kycStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Review & Submit</h2>
                <div className="bg-[#1a1c1d] rounded p-3 text-sm text-foreground space-y-1">
                  <div><b>Name:</b> {kycInfo.fullName}</div>
                  <div><b>DOB:</b> {kycInfo.dob}</div>
                  <div><b>Address:</b> {kycInfo.address}</div>
                  <div><b>ID Type:</b> {kycInfo.idType}</div>
                  <div><b>ID File:</b> {kycInfo.idFile ? kycInfo.idFile.name : "-"}</div>
                  <div><b>Selfie:</b> {kycInfo.selfie ? kycInfo.selfie.name : "-"}</div>
                </div>
                <div className="flex gap-2 justify-between">
                  <Button className="bg-[#1a1c1d] text-white flex-1" onClick={() => setKycStep(3)}>Back</Button>
                  <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white flex-1" onClick={() => { setKycStatus("pending"); setKycStep(5); }}>Submit</Button>
                </div>
              </div>
            )}
            {kycStep === 5 && (
              <div className="space-y-4 text-center">
                <h2 className="text-lg font-bold text-foreground">KYC Status</h2>
                {kycStatus === "pending" && (
                  <>
                    <div className="text-yellow-400">Your KYC is under review. You will be notified when it is approved.</div>
                    <Button className="mt-4 bg-[#FF6600] hover:bg-[#e55a00] text-white" onClick={() => { setKycStatus("approved"); setKycApproved(true); setShowKycModal(false); }}>Simulate Approval</Button>
                  </>
                )}
                {kycStatus === "approved" && (
                  <div className="text-green-400">KYC Approved! You can now connect your bank account.</div>
                )}
                {kycStatus === "rejected" && (
                  <div className="text-red-400">KYC Rejected. Please try again or contact support.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 