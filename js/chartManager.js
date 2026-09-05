/**
 * 교과군별 이수 비중 Chart.js 파스텔 도넛 차트 관리자
 */

import { categoryColors } from "./defaultData.js";

let chartInstance = null;

export function initChart(canvasId, initialData = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return null;

  const categories = Object.keys(categoryColors);
  const bgColors = categories.map(cat => categoryColors[cat]?.accent || "#94A3B8");
  const borderColors = categories.map(cat => categoryColors[cat]?.border || "#E2E8F0");

  const dataValues = categories.map(cat => initialData[cat] || 0);

  // 중앙 텍스트 플러그인
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();

      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 상단 라벨
      ctx.font = '600 12px "Pretendard", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('현재 이수', width / 2, height / 2 - 12);

      // 메인 학점 숫자
      ctx.font = '800 24px "Outfit", "Pretendard", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(`${total}학점`, width / 2, height / 2 + 10);

      ctx.restore();
    }
  };

  chartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          data: dataValues,
          backgroundColor: bgColors,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false // 카드 아래에 커스텀 파스텔 범례를 렌더링
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1E293B',
          bodyColor: '#334155',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          cornerRadius: 8,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const val = context.raw || 0;
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${context.label}: ${val}학점 (${pct}%)`;
            }
          }
        }
      },
      animation: {
        duration: 400,
        easing: 'easeOutQuart'
      }
    },
    plugins: [centerTextPlugin]
  });

  return chartInstance;
}

export function updateChart(categoryData) {
  if (!chartInstance) return;

  const categories = Object.keys(categoryColors);
  const newValues = categories.map(cat => categoryData[cat] || 0);

  chartInstance.data.datasets[0].data = newValues;
  chartInstance.update();
}
