import * as React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { usePokemonList } from "../hooks/usePokemonList";

export default function AutoCompleteFilter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { items, hasMore, isLoading, onLoadMore } = usePokemonList({ fetchDelay: 1500 });

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // Não queremos mostrar o loader no final da lista
    onLoadMore,
  });

  return (
    <Autocomplete
      className="max-w-xs"
      variant="bordered"
      isLoading={isLoading}
      defaultItems={items}
      label="Pick a Pokemon"
      placeholder="Select a Pokemon"
      scrollRef={scrollerRef}
      onOpenChange={setIsOpen}
    >
      {(item) => (
        <AutocompleteItem key={item.name} className="capitalize">
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
