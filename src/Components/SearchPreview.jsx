import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import Fallback from "./Loader/Fallback";
import { useNavigate } from "react-router-dom";

function SearchPreview({ query,setQuery }) {
  const navigate = useNavigate();

  const handleProductSelect = async(id) => {
    setQuery("");
    navigate(`/product/${id}`);

  };

  const { data, error, loading } = useSupabaseQuery({
    table: "products",
  });
  const filteredData = Array.isArray(data)
    ? data.filter((d) => d.title.toLowerCase().startsWith(query.toLowerCase()))
    : [];

  return (
    <ul className="">
      {loading ? (
        <Fallback />
      ) : error ? (
        <p className="text-muted-foreground text-center">There was an error.</p>
      ) : filteredData?.length === 0 ? (
        <p className="text-muted-foreground text-center p-3">
          No matching products found.
        </p>
      ) : (
        filteredData.map((d) => (
          <li
            key={d.id}
            className="hover:bg-gray-200 p-3 cursor-pointer"
            onClick={() => handleProductSelect(d.id)}
          >
            {d.title}
          </li>
        ))
      )}
    </ul>
  );
}

export default SearchPreview;
