// SARChart.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './histogram.css';
import { useTranslation } from 'react-i18next';

const SARChart = ({ data }) => {
  const { t } = useTranslation();
  const [parsedData, setParsedData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showTable, setShowTable] = useState(false); 
  const [sarValues, setSarValues] = useState([]);

  console.log(data);

  useEffect(() => {
    calculateSARValues(data);
  }, [data]);

  const calculateSARValues = (data) => {
    const newSarValues = data.map((sample) => {
      const Na = parseFloat(sample['Sodium']);
      const Ca = parseFloat(sample['Calcium']);
      const Mg = parseFloat(sample['Magnesium']);

      if (isNaN(Na) || isNaN(Ca) || isNaN(Mg) || Ca + Mg === 0) {
        return null;
      }

      return Na / Math.sqrt(Ca + Mg);
    });

    setSarValues(newSarValues);
  };

  if (!sarValues || sarValues.length === 0 || sarValues.some(value => value === null)) {
    return <div>{t('error')}</div>;
  }

  const xValues = data.map((sample, index) => t('sample', { index: index + 1 }));
  const yValues = sarValues;

  const interpretSAR = (sarValue) => {
    if (sarValue >= 1 && sarValue <= 9) {
      return t('low');
    } else if (sarValue >= 10 && sarValue <= 17) {
      return t('medium');
    } else if (sarValue >= 18 && sarValue <= 25) {
      return t('high');
    } else if (sarValue >= 26 && sarValue <= 225) {
      return t('very-high');
    } else if (sarValue >= 226) {
      return t('very-high-caution');
    } else {
      return t('invalid');
    };
  };

  const interpretations = sarValues.map((value) => interpretSAR(value));
  const defaultBarColor = 'rgb(25, 52, 59)';
  const hoverBarColor = 'rgb(143, 182, 112)'; 
  const plotData = [
    {
      x: xValues,
      y: yValues,
      type: 'bar',
      marker: { color: xValues.map((_, index) => (index === hoveredIndex ? hoverBarColor : defaultBarColor)) },
      hoverinfo: 'yValues',
    },
  ];

  const layout = {
    title: {
      text: t('sar-chart-title'),
      font: {
        size: 20,
        color: 'rgb(0, 0, 0)',
        family: 'Arial',
        weight: 'bold',
      },
      yaxis: { title: t('sar-axis-title') },
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    autosize: false,
    width: 500,
    height: 500,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
    },
    plot_bgcolor: 'rgba(255, 255, 255, 0.9)',
    showlegend: false,
    border: {
      color: 'rgb(25, 52, 59)',
      width: 2,
    },
    boxshadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
  };
  
  const tableData = xValues.map((sampleId, index) => ({
    Sample: sampleId,
    SAR: yValues[index],
    Interpretation: interpretations[index],
  }));

  return (
    <div className="sar-chart-container">
      <div className="chart-container">
        <Plot
          data={plotData}
          layout={layout}
          config={{ displayModeBar: false }}
          onHover={(event) => {
            const pointNumber = event.points[0].pointNumber;
            setHoveredIndex(pointNumber);
          }}
          onUnhover={() => {
            setHoveredIndex(null);
          }}
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)' }}
        />
      </div>
      <button className="interpretation" onClick={() => setShowTable(!showTable)}>
        <p className='interpret'>{t('interpretation')}</p>
      </button>

      {showTable && (
        <table className='table'>
          <thead>
            <tr>
              <th>{t('sample-header')}</th>
              <th>{t('sar-header')}</th>
              <th>{t('interpretation-header')}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.Sample}</td>
                <td>{row.SAR}</td>
                <td>{row.Interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SARChart;
