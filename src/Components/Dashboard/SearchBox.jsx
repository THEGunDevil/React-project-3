import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
function SearchBox({
  inputType,
  searchedTo = "Find",
  fetchFrom,
  singleFetch,
  column,
  operator,
  searchedBy,
  data,
  setSearchedData,
  loading,
  setLoading = () => {},
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const searchedValue = watch(inputType);
  const {
    data: fetchedData,
    error,
    loading: fetching,
  } = useSupabaseQuery({
    table: [fetchFrom],
    filters: [{ column, operator, value: searchedValue }],
    single: singleFetch,
    enabled: !!searchedValue,
  });

  // Fetch product
  const Fetch = () => {
    if (fetchedData) {
      setSearchedData(fetchedData);
    } else if (error) {
      console.error("Error fetching product:", error);
    } else {
      console.warn("No product found with this ID.");
    }
  };
  useEffect(() => {
    setLoading(fetching); // ✅ safe to call even if not passed from parent
  }, [fetching, setLoading]);

  const Find = () => {
    const matches =
      data?.filter(
        (f) => f[searchedBy ? searchedBy : inputType] === searchedValue
      ) || [];

    if (matches.length === 1) {
      setSearchedData(matches[0]); // single object
    } else if (matches.length > 1) {
      setSearchedData(matches); // array of objects
    } else {
      setSearchedData(null); // no result
    }
  };

  const onSubmit = () => {
    if (searchedTo === "Find") {
      Find();
    } else Fetch();
  };
  return (
    <Card>
      <CardContent className="sm:w-xl max-w-xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">User Search</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:space-y-5 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="text" className="text-primary text-lg">
              User Email
            </Label>
            <Input
              id="text"
              type={inputType}
              placeholder="Enter user data to search"
              {...register(inputType, {
                required: `${inputType} is required`,
              })}
              className="w-full"
            />
            {errors[inputType] && (
              <p className="text-destructive text-[13px] mt-1">
                {errors[inputType].message}
              </p>
            )}

            <p className="text-muted-foreground flex items-center gap-1 text-[13px] mt-1">
              <Info size={13} />
              NOTE: User {inputType} address is required to get the user
              information.
            </p>
          </div>
          <Button
            type="submit"
            disabled={!searchedValue || loading}
            className="hover:bg-green-400 cursor-pointer"
          >
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SearchBox;
