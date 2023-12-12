import { relationCombinations } from "@/app/lib/utils/lists";

export function ManyRelationCombinations() {
  relationCombinations;
  return (
    <>
      {relationCombinations.length > 0 && (
        <>
          <p className="pt-2">
            Select a relation combination between you and this user you've
            selected. (relcombo in searchParams.)
          </p>
          <ol>
            {relationCombinations.map((relationCombination) => {
              return (
                <li key={relationCombination}>
                  <p className="pt-2">{relationCombination}</p>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
