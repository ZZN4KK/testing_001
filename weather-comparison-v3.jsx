import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherComparison = () => {
  const [selectedCities, setSelectedCities] = useState(['london']);
  const [showClimateNormal, setShowClimateNormal] = useState(false);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    london: '#007AFF',
    shanghai: '#FF3B30',
    moscow: '#34C759',
    krasnoyarsk: '#AF52DE'
  };

  const names = {
    london: 'London',
    shanghai: 'Shanghai',
    moscow: 'Moscow',
    krasnoyarsk: 'Krasnoyarsk'
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Temperature conversion utility
  const convertTemp = (celsius) => {
    return useFahrenheit ? (celsius * 9/5) + 32 : celsius;
  };

  const formatTemp = (celsius) => {
    const temp = convertTemp(celsius);
    return `${temp.toFixed(1)}°${useFahrenheit ? 'F' : 'C'}`;
  };

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== city));
      }
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  // Handle keyboard navigation for city buttons
  const handleCityKeyPress = (e, city) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCity(city);
    }
  };

  // Build chart data with temperature conversion
  const chartData = useMemo(() => {
    return months.map((month, i) => {
      const point = { month, index: i };

      Object.keys(data).forEach(city => {
        const dataset = showClimateNormal ? data[city].normal : data[city].recent;
        point[`${city}_day`] = convertTemp(dataset.day[i]);
        point[`${city}_night`] = convertTemp(dataset.night[i]);
      });

      return point;
    });
  }, [showClimateNormal, useFahrenheit]);

  // Calculate Y-axis domain with converted temperatures
  const yAxisDomain = useMemo(() => {
    let minTemp = 0;
    let maxTemp = 0;
    selectedCities.forEach(city => {
      const dataset = showClimateNormal ? data[city].normal : data[city].recent;
      minTemp = Math.min(minTemp, ...dataset.night.map(convertTemp));
      maxTemp = Math.max(maxTemp, ...dataset.day.map(convertTemp));
    });
    return [Math.floor(minTemp) - 2, Math.ceil(maxTemp) + 2];
  }, [selectedCities, showClimateNormal, useFahrenheit]);

  // Theme colors
  const theme = {
    background: isDarkMode ? '#000000' : '#F5F5F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#1D1D1F',
    textSecondary: isDarkMode ? '#98989D' : '#6E6E73',
    border: isDarkMode ? '#38383A' : '#D2D2D7',
    gridColor: isDarkMode ? '#2C2C2E' : '#E5E5EA'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.background,
      padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      transition: 'background-color 0.3s ease',
      color: theme.text
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header Section */}
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #98989D 100%)'
                  : 'linear-gradient(135deg, #1D1D1F 0%, #6E6E73 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Weather Comparison
              </h1>
              <p style={{
                fontSize: '17px',
                color: theme.textSecondary,
                margin: 0,
                fontWeight: '400'
              }}>
                Compare temperature patterns across global cities
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: theme.cardBackground,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: isDarkMode
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Control Panel */}
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: isDarkMode
            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 2px 16px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}>

          {/* City Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: theme.textSecondary,
              marginBottom: '12px'
            }}>
              Select Cities
            </label>
            <div
              role="group"
              aria-label="City selection"
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              {Object.keys(names).map(city => {
                const isSelected = selectedCities.includes(city);
                return (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    onKeyPress={(e) => handleCityKeyPress(e, city)}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${names[city]}`}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: isSelected ? colors[city] : theme.cardBackground,
                      color: isSelected ? '#FFFFFF' : theme.text,
                      border: isSelected ? 'none' : `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected
                        ? `0 4px 12px ${colors[city]}40`
                        : 'none',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = colors[city];
                        e.currentTarget.style.color = colors[city];
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.color = theme.text;
                      }
                    }}
                  >
                    {names[city]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Row */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.border}`
          }}>

            {/* Time Period Toggle */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: theme.textSecondary,
                marginBottom: '12px'
              }}>
                Data Period
              </label>
              <button
                onClick={() => setShowClimateNormal(!showClimateNormal)}
                aria-label={`Switch to ${showClimateNormal ? 'recent 5-year data' : '30-year climate normal'}`}
                style={{
                  padding: '12px 20px',
                  width: '100%',
                  backgroundColor: showClimateNormal ? '#5E5CE6' : theme.cardBackground,
                  color: showClimateNormal ? '#FFFFFF' : theme.text,
                  border: showClimateNormal ? 'none' : `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {showClimateNormal ? '📊 Climate Normal (1991-2020)' : '📈 Recent Data (2020-2024)'}
              </button>
            </div>

            {/* Temperature Unit Toggle */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: theme.textSecondary,
                marginBottom: '12px'
              }}>
                Temperature Unit
              </label>
              <button
                onClick={() => setUseFahrenheit(!useFahrenheit)}
                aria-label={`Switch to ${useFahrenheit ? 'Celsius' : 'Fahrenheit'}`}
                style={{
                  padding: '12px 20px',
                  width: '100%',
                  backgroundColor: useFahrenheit ? '#FF9500' : theme.cardBackground,
                  color: useFahrenheit ? '#FFFFFF' : theme.text,
                  border: useFahrenheit ? 'none' : `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {useFahrenheit ? '🌡️ Fahrenheit (°F)' : '🌡️ Celsius (°C)'}
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        {selectedCities.length > 0 ? (
          <div style={{
            backgroundColor: theme.cardBackground,
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: isDarkMode
              ? '0 4px 16px rgba(0, 0, 0, 0.4)'
              : '0 2px 16px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease'
          }}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.gridColor}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 13, fill: theme.textSecondary, fontWeight: '500' }}
                  stroke={theme.border}
                  axisLine={{ strokeWidth: 2 }}
                />
                <YAxis
                  domain={yAxisDomain}
                  label={{
                    value: `Temperature (°${useFahrenheit ? 'F' : 'C'})`,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 13, fill: theme.textSecondary, fontWeight: '600' }
                  }}
                  tick={{ fontSize: 13, fill: theme.textSecondary, fontWeight: '500' }}
                  stroke={theme.border}
                  axisLine={{ strokeWidth: 2 }}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}°${useFahrenheit ? 'F' : 'C'}`]}
                  contentStyle={{
                    backgroundColor: theme.cardBackground,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: isDarkMode
                      ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                      : '0 4px 12px rgba(0, 0, 0, 0.15)',
                    color: theme.text
                  }}
                  labelStyle={{
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: theme.text
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '24px' }}
                  iconType="line"
                />

                {selectedCities.map(city => [
                  <Line
                    key={`${city}_day`}
                    type="monotone"
                    dataKey={`${city}_day`}
                    stroke={colors[city]}
                    strokeWidth={3}
                    name={`${names[city]} Day`}
                    dot={{ r: 4, fill: colors[city], strokeWidth: 2, stroke: theme.cardBackground }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                  />,
                  <Line
                    key={`${city}_night`}
                    type="monotone"
                    dataKey={`${city}_night`}
                    stroke={colors[city]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={`${names[city]} Night`}
                    dot={{ r: 3, fill: colors[city], strokeWidth: 2, stroke: theme.cardBackground }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    opacity={0.7}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                  />
                ]).flat()}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{
            backgroundColor: theme.cardBackground,
            borderRadius: '20px',
            padding: '64px 32px',
            textAlign: 'center',
            boxShadow: isDarkMode
              ? '0 4px 16px rgba(0, 0, 0, 0.4)'
              : '0 2px 16px rgba(0, 0, 0, 0.08)',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
            <p style={{
              fontSize: '17px',
              color: theme.textSecondary,
              margin: 0
            }}>
              Select at least one city to view temperature data
            </p>
          </div>
        )}

        {/* Statistics Cards */}
        {selectedCities.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {selectedCities.map(city => {
              const dataset = showClimateNormal ? data[city].normal : data[city].recent;
              const maxDay = Math.max(...dataset.day);
              const minNight = Math.min(...dataset.night);
              const avgDay = dataset.day.reduce((a, b) => a + b) / 12;
              const avgNight = dataset.night.reduce((a, b) => a + b) / 12;
              const maxDayMonth = months[dataset.day.indexOf(maxDay)];
              const minNightMonth = months[dataset.night.indexOf(minNight)];
              const tempRange = maxDay - minNight;

              return (
                <article
                  key={city}
                  aria-label={`${names[city]} statistics`}
                  style={{
                    padding: '24px',
                    background: `linear-gradient(135deg, ${colors[city]}15 0%, ${colors[city]}05 100%)`,
                    borderLeft: `4px solid ${colors[city]}`,
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? `0 8px 24px ${colors[city]}40`
                      : `0 8px 24px ${colors[city]}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    color: colors[city],
                    letterSpacing: '-0.01em'
                  }}>
                    {names[city]}
                  </h3>
                  <div style={{ fontSize: '15px', color: theme.text, lineHeight: '1.6' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      paddingBottom: '10px',
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                      <span style={{ color: theme.textSecondary }}>Warmest Day</span>
                      <strong>{formatTemp(maxDay)} <span style={{ fontSize: '13px', color: theme.textSecondary }}>({maxDayMonth})</span></strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      paddingBottom: '10px',
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                      <span style={{ color: theme.textSecondary }}>Coldest Night</span>
                      <strong>{formatTemp(minNight)} <span style={{ fontSize: '13px', color: theme.textSecondary }}>({minNightMonth})</span></strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      paddingBottom: '10px',
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                      <span style={{ color: theme.textSecondary }}>Temperature Range</span>
                      <strong>{formatTemp(tempRange)}</strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: theme.textSecondary }}>Avg Day</span>
                      <strong>{formatTemp(avgDay)}</strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: theme.textSecondary }}>Avg Night</span>
                      <strong>{formatTemp(avgNight)}</strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <footer style={{
          padding: '20px',
          backgroundColor: theme.cardBackground,
          borderRadius: '16px',
          fontSize: '13px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          boxShadow: isDarkMode
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <strong style={{ color: theme.text }}>Data Sources:</strong> London 5-year data from UK Met Office; 30-year climate normals from WMO.
          All temperatures displayed in {useFahrenheit ? 'Fahrenheit' : 'Celsius'}. Solid lines represent daytime temperatures, dashed lines represent nighttime temperatures.
        </footer>
      </div>
    </div>
  );
};

export default WeatherComparison;
