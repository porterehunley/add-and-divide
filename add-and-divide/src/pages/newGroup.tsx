import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewGroup() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-[#2c2c54]">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#6b5b95]">Expense Tracker</h1>
        <div className="space-y-4">
          <div className="border-t border-[#e6e6e6] dark:border-[#3c3c58] pt-4">
            <form className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 border-[#e6e6e6] dark:border-[#3c3c58] bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
                  placeholder="Add Expense"
                  type="text"
                />
                <Button className="bg-[#9370db] hover:bg-[#8258fa] text-white">Add</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}