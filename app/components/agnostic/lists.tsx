import { relationCombinations } from "@/app/libraries/utilities/relcombos";

export function ManyRelationCombinations() {
  relationCombinations;
  return (
    <>
      {relationCombinations.length > 0 && (
        <>
          <p className="mt-2">
            Select a relation combination between you and this user you&apos;ve
            selected. (relcombo in searchParams.)
          </p>
          <ol>
            {relationCombinations.map((relationCombination) => {
              return (
                <li key={relationCombination}>
                  <p className="mt-2">{relationCombination}</p>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
