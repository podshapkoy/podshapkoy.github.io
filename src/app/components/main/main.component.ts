import {Component, ElementRef, NgIterable, ViewChild} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @ViewChild('canvasElement', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

  selectedR!: number;
  selectedX!: number;
  selectedY!: number;
  rValues: number[] = [0, 1, 2, 3, 4, 5];
  xValues: number[] = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  formValid: boolean = false;
  invalidInput: boolean = false;
  errorMessage: string = '';

  ngAfterViewInit(): void {
    this.drawCoordinateAxes();
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.selectedR) {
      this.errorMessage = 'Сначала выберите значение R.';
      return;
    }
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const insideArea = this.checkPointInsideArea(x, y);
    this.drawPoint(x, y, insideArea);
  }
  checkPointInsideArea(x: number, y: number): boolean {
    const selectedR = this.selectedR;

    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    const transformedX = ((x / canvasRect.width) * (2 * selectedR)) - selectedR;
    const transformedY = (1 - (y / canvasRect.height)) * (2 * selectedR) - selectedR;

    const roundedX = parseFloat(transformedX.toFixed(1));
    const roundedY = parseFloat(transformedY.toFixed(1));

    let insideArea: boolean = false;

    if (selectedR >= 0) {
      insideArea = (roundedX >= 0 && roundedY <= 0 && roundedX * roundedX + roundedY * roundedY <= selectedR * selectedR / 4);
    } else {
      insideArea = (roundedX <= 0 && roundedY <= 0 && roundedX >= -selectedR && roundedY >= -2 * selectedR) ||
        (roundedX >= 0 && roundedY >= 0 && roundedX <= selectedR && roundedY <= selectedR) ||
        (roundedX <= 0 && roundedY >= 0 && roundedY <= 2 * roundedX + selectedR);

      if (!insideArea) {
        insideArea = (roundedX <= 0 && roundedY >= 0 && roundedY <= 2 * roundedX + selectedR && roundedX >= -selectedR / 2);
      }
    }

    return insideArea;
  }


  drawPoint(x: number, y: number, insideArea: boolean): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = insideArea ? 'green' : 'blue';
      ctx.fill();
    }
  }


  drawCoordinateAxes(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const arrowSize = 8;
      const axisMargin = 20;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Рисуем ось X
      ctx.beginPath();
      ctx.moveTo(axisMargin, centerY);
      ctx.lineTo(canvas.width - axisMargin, centerY);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Рисуем стрелку для оси X
      ctx.beginPath();
      ctx.moveTo(canvas.width - axisMargin - arrowSize, centerY - arrowSize);
      ctx.lineTo(canvas.width - axisMargin, centerY);
      ctx.lineTo(canvas.width - axisMargin - arrowSize, centerY + arrowSize);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Подписываем ось X
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText('X', canvas.width - axisMargin + 4, centerY + 20);

      // Рисуем ось Y
      ctx.beginPath();
      ctx.moveTo(centerX, axisMargin);
      ctx.lineTo(centerX, canvas.height - axisMargin);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Рисуем стрелку для оси Y
      ctx.beginPath();
      ctx.moveTo(centerX - arrowSize, axisMargin + arrowSize);
      ctx.lineTo(centerX, axisMargin);
      ctx.lineTo(centerX + arrowSize, axisMargin + arrowSize);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Подписываем ось Y
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText('Y', centerX - 20, axisMargin - 4);


      var rectWidth = canvas.width;
      var rectHeight = canvas.width / 2;

      var scale = canvas.width / (2.5 * canvas.width);

      // Координаты прямоугольника
      var rectX1 = centerX;
      var rectY1 = centerY;
      var rectX2 = centerX - rectWidth * scale;
      var rectY2 = centerY;
      var rectX3 = centerX - rectWidth * scale;
      var rectY3 = centerY - rectHeight * scale;
      var rectX4 = centerX;
      var rectY4 = centerY - rectHeight * scale;


      ctx.beginPath();
      ctx.moveTo(rectX1, rectY1);
      ctx.lineTo(rectX2, rectY2);
      ctx.lineTo(rectX3, rectY3);
      ctx.lineTo(rectX4, rectY4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(230,0,255,0.2)';
      ctx.fill();

      // Координаты треугольника
      var trianX1 = centerX;
      var trianY1 = centerY;
      var trianX2 = centerX - (rectHeight) * scale;
      var trianY2 = centerY;
      var trianX3 = centerX;
      var trianY3 = centerY - (-rectHeight) * scale;

      ctx.beginPath();
      ctx.moveTo(trianX1, trianY1);
      ctx.lineTo(trianX2, trianY2);
      ctx.lineTo(trianX3, trianY3);
      ctx.closePath();
      ctx.fillStyle = 'rgba(230,0,255,0.2)';
      ctx.fill();

      // Координаты вершин четверти окружности
      ctx.beginPath();
      ctx.arc(centerX, centerY, rectWidth * scale / 2, Math.PI / 2, 0, true);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(230,0,255,0.2)';
      ctx.fill();

    }
  }
  clearCanvas(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawCoordinateAxes();
    }
  }
  logOut(): void {
  }

  clearModel(): void {
  }
}
