import * as React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useSession } from "next-auth/react";

export default function AutoCompleteFilter() {
  const {data:session}:any = useSession()

  let list = useAsyncList({
    async load({signal, filterText}) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/all/companyteste/${session?.user.company.id}?search=${filterText}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user.token as string}`,
        },
        signal
      });
      let json = await res.json();

      return {
        items: json.results
      };
    },
  });
  
  return (
    <Autocomplete
    className="max-w-xs"
    inputValue={list.filterText}
    isLoading={list.isLoading}
    items={list.items}
    label="Select a character"
    placeholder="Type to search..."
    variant="bordered"
    onInputChange={list.setFilterText}
    >
      {(item:any) => (
        <AutocompleteItem key={item.name} className="capitalize">
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
