import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
export function BanConfirmPopUp({
  banPopUp,
  cancelBtn,
  confirmBtn,
  inputValue,
  setInputValue,
  errorMessage,
  currentStatus,
}) {
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <section className="absolute z-50 top-1/2 left-1/2 -translate-1/2 flex w-screen h-screen justify-center items-center">
      <Dialog open={banPopUp} onOpenChange={cancelBtn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are You Sure You Want to {currentStatus ? "Ban" : "Unban"} This
              User?
            </DialogTitle>
            <DialogDescription>
              This action will block this user from all your services.
            </DialogDescription>
            <p className="text- text-shadow-destructive">
              ⚠️ To proceed with {currentStatus ? "banning" : "unbanning"},
              please write{" "}
              <b>{currentStatus ? "Confirm Ban" : "Confirm Unban"}</b> below.
            </p>
            <Input
              type="text"
              value={inputValue}
              onChange={handleChange}
            ></Input>
            {errorMessage && <p className="text-destructive">{errorMessage}</p>}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBtn}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBtn}
              className="cursor-pointer hover:bg-red-700"
            >
              {currentStatus ? "Confirm Ban" : "Confirm Unban"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
