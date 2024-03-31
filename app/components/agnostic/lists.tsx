import { relationCombinations } from "@/app/libraries/utilities/relcombos";

export function ManyRelationCombinations() {
  relationCombinations;
  return (
    <>
      {relationCombinations.length > 0 && (
        <>
          <label className="mt-2" htmlFor="rel-combo">
            <p>
              Type a relation combination between you and this user you&apos;ve
              selected.
            </p>
          </label>
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
