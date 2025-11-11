"use client";

import { Header } from "@/components/index";
import { useState, useEffect } from "react";
import {
  VictoryPie,
  VictoryTheme,
  VictoryLine,
  VictoryChart,
  VictoryAxis,
} from "victory";
import { supabase } from "@/lib/supabaseClient";

function truncateText(text: string, maxLength = 10) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

type SubjectData = { x: string; y: number };
type LineDataPoint = { x: Date; y: number };

const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

function Statistic() {
  const [data, setData] = useState<SubjectData[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lineData, setLineData] = useState<LineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) return;

        const res = await fetch("/api/stats/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch subjects");
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      setLineData([]);
      return;
    }

    const fetchLineData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      const res = await fetch(
        `/api/stats/subjects/${encodeURIComponent(selectedSubject)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setLineData([]);
        return;
      }

      const json = await res.json();
      if (Array.isArray(json)) {
        const parsed = json.map((item: any) => ({
          x: new Date(item.x),
          y: item.y,
        }));
        setLineData(parsed);
      } else {
        setLineData([]);
      }
    };

    fetchLineData();
  }, [selectedSubject]);

  return (
    <div>
      <Header />
      <div className="pl-[30px] pt-[40px]">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Кількість завдань по предметам
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Завантаження...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">
            Додайте хоча б одне завдання, щоб побачити статистику
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div
              className="flex-shrink-0"
              style={{ width: "500px", height: "500px" }}
            >
              <VictoryPie
                data={data}
                labelRadius={50}
                theme={VictoryTheme.material}
                colorScale={COLORS}
                labels={({ datum }) =>
                  `${truncateText(datum.x, 10)}\n(${datum.y})`
                }
                style={{ labels: { fontSize: 11, fill: "#333" } }}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onClick: () => [
                        {
                          target: "data",
                          mutation: (props) => {
                            setSelectedSubject(props.datum.x);
                            return null;
                          },
                        },
                      ],
                    },
                  },
                ]}
              />
            </div>

            <div className="p-6 rounded-lg flex flex-col items-start">
              <h2 className="font-semibold mb-4">Предмети</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => setSelectedSubject(item.x)}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{item.x}</span>
                  </div>
                ))}
              </div>

              {selectedSubject && (
                <div className="mt-6 w-full max-w-md">
                  <h3 className="font-semibold mb-2 text-center">
                    {selectedSubject}
                  </h3>
                  {lineData.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Немає даних для цього предмету
                    </p>
                  ) : (
                    <VictoryChart theme={VictoryTheme.material}>
                      <VictoryAxis
                        fixLabelOverlap
                        tickFormat={(t: Date | number) =>
                          t instanceof Date
                            ? t.toLocaleDateString()
                            : new Date(t).toLocaleDateString()
                        }
                      />
                      <VictoryAxis dependentAxis />
                      <VictoryLine data={lineData} />
                    </VictoryChart>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistic;
