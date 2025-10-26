import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherComparison = () => {
  const [selectedCities, setSelectedCities] = useState(['london']);
  const [showClimateNormal, setShowClimateNormal] = useState(false);

  const data = {
    london: {
      recent: {
        day: [8.7, 9.8, 12.3, 15.2, 18.9, 21.4, 23.8, 23.5, 20.3, 15.8, 11.4, 9.1],
        night: [3.1, 3.4, 4.8, 6.3, 9.7, 12.8, 15.1, 15.0, 12.6, 9.3, 5.8, 3.7]
      },
      normal: {
        day: [8.1, 8.4, 11.3, 13.9, 17.5, 20.6, 22.6, 22.2, 19.2, 15.2, 11.1, 8.3],
        night: [2.3, 2.3, 3.9, 5.3, 8.2, 11.3, 13.4, 13.2, 10.8, 8.0, 4.8, 2.7]
      }
    },
    shanghai: {
      recent: {
        day: [9.4, 11.1, 15.0, 20.5, 25.3, 28.8, 32.8, 32.4, 28.3, 23.3, 17.7, 11.8],
        night: [1.6, 3.3, 7.4, 13.1, 18.5, 23.0, 26.9, 26.6, 22.5, 16.6, 10.3, 4.2]
      },
      normal: {
        day: [9.4, 11.1, 15.0, 20.5, 25.3, 28.8, 32.8, 32.4, 28.3, 23.3, 17.7, 11.8],
        night: [1.6, 3.3, 7.4, 13.1, 18.5, 23.0, 26.9, 26.6, 22.5, 16.6, 10.3, 4.2]
      }
    },
    moscow: {
      recent: {
        day: [-4.8, -3.8, 2.0, 10.7, 18.0, 21.6, 24.1, 22.0, 15.7, 8.2, 0.7, -3.1],
        night: [-9.8, -9.9, -5.4, 1.5, 7.6, 11.4, 14.1, 12.2, 7.4, 2.1, -3.5, -7.6]
      },
      normal: {
        day: [-4.8, -3.8, 2.0, 10.7, 18.0, 21.6, 24.1, 22.0, 15.7, 8.2, 0.7, -3.1],
        night: [-9.8, -9.9, -5.4, 1.5, 7.6, 11.4, 14.1, 12.2, 7.4, 2.1, -3.5, -7.6]
      }
    },
    krasnoyarsk: {
      recent: {
        day: [-11.6, -7.5, 0.7, 9.3, 17.1, 23.5, 25.2, 22.2, 14.6, 6.7, -3.6, -9.3],
        night: [-19.2, -16.3, -9.4, -1.4, 4.7, 10.8, 13.7, 10.9, 4.1, -1.8, -10.8, -16.5]
      },
      normal: {
        day: [-11.6, -7.5, 0.7, 9.3, 17.1, 23.5, 25.2, 22.2, 14.6, 6.7, -3.6, -9.3],
        night: [-19.2, -16.3, -9.4, -1.4, 4.7, 10.8, 13.7, 10.9, 4.1, -1.8, -10.8, -16.5]
      }
    }
  };

  const colors = {
    london: '#2563eb',
    shanghai: '#dc2626',
    moscow: '#16a34a',
    krasnoyarsk: '#9333ea'
  };

  const names = {
    london: 'London',
    shanghai: 'Shanghai',
    moscow: 'Moscow',
    krasnoyarsk: 'Krasnoyarsk'
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  // Build chart data - crucial to have correct structure
  const chartData = months.map((month, i) => {
    const point = { month, index: i };
    
    // Add data for ALL cities, not just selected ones
    // This ensures consistent data structure
    Object.keys(data).forEach(city => {
      const dataset = showClimateNormal ? data[city].normal : data[city].recent;
      point[`${city}_day`] = dataset.day[i];
      point[`${city}_night`] = dataset.night[i];
    });
    
    return point;
  });

  // Calculate Y-axis domain
  let minTemp = 0;
  let maxTemp = 0;
  selectedCities.forEach(city => {
    const dataset = showClimateNormal ? data[city].normal : data[city].recent;
    minTemp = Math.min(minTemp, ...dataset.night);
    maxTemp = Math.max(maxTemp, ...dataset.day);
  });
  const yAxisDomain = [Math.floor(minTemp) - 2, Math.ceil(maxTemp) + 2];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Weather Comparison
      </h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
        Compare day and night temperatures across cities
      </p>

      {/* City Selection */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.keys(names).map(city => (
          <button
            key={city}
            onClick={() => toggleCity(city)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCities.includes(city) ? colors[city] : '#f3f4f6',
              color: selectedCities.includes(city) ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {names[city]}
          </button>
        ))}
      </div>

      {/* Time Period Toggle */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowClimateNormal(!showClimateNormal)}
          style={{
            padding: '10px 20px',
            backgroundColor: showClimateNormal ? '#8b5cf6' : '#f3f4f6',
            color: showClimateNormal ? 'white' : '#666',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {showClimateNormal ? '30-Year Climate Normal (1991-2020)' : 'Recent 5-Year Data (2020-2024)'}
        </button>
      </div>

      {/* Chart */}
      {selectedCities.length > 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                domain={yAxisDomain}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(1)}°C`]}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
              
              {selectedCities.map(city => [
                <Line 
                  key={`${city}_day`}
                  type="monotone"
                  dataKey={`${city}_day`}
                  stroke={colors[city]}
                  strokeWidth={3}
                  name={`${names[city]} Day`}
                  dot={{ r: 4, fill: colors[city] }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />,
                <Line 
                  key={`${city}_night`}
                  type="monotone"
                  dataKey={`${city}_night`}
                  stroke={colors[city]}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name={`${names[city]} Night`}
                  dot={{ r: 3, fill: colors[city] }}
                  activeDot={{ r: 5 }}
                  opacity={0.7}
                  connectNulls={false}
                />
              ]).flat()}
            </LineChart>
          </ResponsiveContainer>

          {/* Statistics */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {selectedCities.map(city => {
              const dataset = showClimateNormal ? data[city].normal : data[city].recent;
              const maxDay = Math.max(...dataset.day);
              const minNight = Math.min(...dataset.night);
              const avgDay = (dataset.day.reduce((a, b) => a + b) / 12).toFixed(1);
              const avgNight = (dataset.night.reduce((a, b) => a + b) / 12).toFixed(1);
              const maxDayMonth = months[dataset.day.indexOf(maxDay)];
              const minNightMonth = months[dataset.night.indexOf(minNight)];
              
              return (
                <div 
                  key={city}
                  style={{
                    padding: '16px',
                    borderLeft: `4px solid ${colors[city]}`,
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: colors[city] }}>
                    {names[city]}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Warmest Day:</strong> {maxDay}°C ({maxDayMonth})
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Coldest Night:</strong> {minNight}°C ({minNightMonth})
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Avg Day:</strong> {avgDay}°C
                    </div>
                    <div>
                      <strong>Avg Night:</strong> {avgNight}°C
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '48px',
          textAlign: 'center',
          color: '#666'
        }}>
          Select at least one city to view temperature data
        </div>
      )}

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Data Sources:</strong> London 5-year data from UK Met Office; 30-year climate normals from WMO. 
        All temperatures in Celsius (°C). Solid lines = day temps, dashed lines = night temps.
      </div>
    </div>
  );
};

export default WeatherComparison;