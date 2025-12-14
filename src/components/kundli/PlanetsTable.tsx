import React from "react";

interface PlanetData {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string | boolean;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface PlanetsTableProps {
  planetary: PlanetData[];
}

const PlanetsTable: React.FC<PlanetsTableProps> = ({ planetary }) => {
  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "--";
    return value;
  };

  const getRetroStatus = (isRetro: string | boolean) => {
    if (typeof isRetro === "boolean") return isRetro ? "Retro" : "Direct";
    return isRetro === "true" ? "Retro" : "Direct";
  };

  const getCombustStatus = (isPlanetSet: boolean) => {
    return isPlanetSet ? "Yes" : "No";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Planet
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Sign
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Sign Lord
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Nakshatra
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Naksh Lord
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Degree
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Retro(R)
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Combust
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Avastha
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              House
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {planetary.map((planet, index) => (
            <tr
              key={planet.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.name)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.sign)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.signLord)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.nakshatra)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.nakshatraLord)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.normDegree?.toFixed(2))}°
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getRetroStatus(planet.isRetro)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getCombustStatus(planet.is_planet_set)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.planet_awastha)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                {getValue(planet.house)}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                --
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanetsTable;
