import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-days-off-dialog',
    templateUrl: './daysOffDialog.component.html',
    styleUrls: ['./daysOffDialog.component.css']
})
export class DaysOffDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DaysOffDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public daysOff: DayOff[]) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

export interface DayOff {
    name: string;
    isFreeDay: boolean;
}

