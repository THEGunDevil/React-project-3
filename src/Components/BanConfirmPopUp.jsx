import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
export function BanConfirmPopUp({
  banPopUp,
  cancelBan,
  confirmBan,
  inputValue,
  setInputValue,
  errorMessage,
}) {
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <section className="absolute z-50 top-1/2 left-1/2 -translate-1/2 flex w-screen h-screen justify-center items-center">
      {" "}
      <Dialog open={banPopUp} onOpenChange={cancelBan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure You Want to Ban This User?</DialogTitle>
            <p className="text- text-shadow-destructive">
              ⚠️ To proceed with banning, please write <b>Confirm Ban</b> below.
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
              onClick={cancelBan}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBan}
              className="cursor-pointer hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
