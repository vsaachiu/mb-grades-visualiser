console.log("I'm running 1!");
var mbresponse;

if (document.readyState !== 'loading') {
  console.log('document is already ready, just execute code here');
  getData();
} else {
  document.addEventListener('DOMContentLoaded', async () => {
    getData();
  });
}

async function getData(){

  const classSelect = document.getElementById('staff_class_list');
    if (!classSelect) return;
    
    // Get the selected class ID
    const vsaClassId = classSelect.value;
    console.log("I'm running 2!");
    // Fetch data from the Google Apps Script API
    //var response = await fetch(`https://script.google.com/a/macros/vsa.edu.hk/s/AKfycbyagcoynMcHhZpSZSyEJ5hfDzt4ReGqYh48IBgDsLWTPCzIShd8MYVanJo-jnFLYYPFgw/exec?vsa_class_id=${vsaClassId}`);
    chrome.runtime.sendMessage({ action: 'fetchClassData', vsaClassId: vsaClassId }, (res) => {
      if (res.data) {
        // Update the DOM with the fetched data
        mbresponse = res.data;
        console.log(mbresponse);
        var data = mbresponse;
        if (data.error) {
          console.error(data.error);
          return;
        }
        startViz(data);
            
      } else if (res.error) {
        classDataElement.textContent = `Error: ${res.error}`;
      }
    });
}

   
  
function startViz(data){  
    // Inject Chart.js dynamically
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('chart.js');
    script.onload = () => {
      // Visualize the data after Chart.js is loaded
      visualizeData(data);
    };
    document.head.appendChild(script);
  }
  
  function visualizeData(data) {
    console.log(data);
    data.forEach(student => {
      const studentDiv = document.getElementById(`auto_calcaluted_subj_score_${student.vsa_student_id}`);
      console.log(student.vsa_student_id);
      console.log(studentDiv);
      if (studentDiv) {
        const graphDiv = document.createElement('div');
        graphDiv.id = `graph_${student.vsa_student_id}`;
        studentDiv.parentNode.insertBefore(graphDiv, studentDiv.nextSibling);
  
        const canvas = document.createElement('canvas');
        graphDiv.appendChild(canvas);
  
        // Filter tasks that have criterion_grades data
        const tasksWithGrades = student.tasks.filter(task => task.criterion_grades);
  
        // Prepare data for the chart
        const labels = [];
        const datasets = [];
  
        // Assign a unique color for each task
        const colors = [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ];
        const borderColors = [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ];
  
        tasksWithGrades.forEach((task, index) => {
          task.criterion_grades.forEach(grade => {
            const label = `${task.task_name} (${grade.label})`;
            labels.push(label);
            datasets.push({
              label: `Task ${task.task_id} - ${grade.label}`,
              data: [grade.score],
              backgroundColor: colors[index % colors.length],
              borderColor: borderColors[index % borderColors.length],
              borderWidth: 1
            });
          });
        });
  
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: datasets
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    return label + ': ' + context.raw;
                  }
                }
              }
            }
          }
        });
      }
    });
  }

 