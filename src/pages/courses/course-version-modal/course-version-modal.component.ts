import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseEntity } from '../../../models/course.model';

@Component({
  selector: 'app-course-version-modal',
  imports: [CommonModule, FormsModule],
  template: `
    @if (course(); as crs) {
      <div class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
        <div class="w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 flex flex-col overflow-hidden animate-scale-up max-h-[90vh]">
          <!-- Modal Header -->
          <div class="p-6 border-b border-base-300 bg-base-200/50 flex items-center justify-between">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
                <span class="material-symbols-outlined text-2xl">history_edu</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-mono">
                    {{ crs.code }}
                  </span>
                  <span class="text-xs font-semibold text-text-secondary">Version Management</span>
                </div>
                <h2 class="text-base font-bold text-text-primary mt-0.5">{{ crs.title }}</h2>
              </div>
            </div>
            <button 
              (click)="close.emit()" 
              class="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-base-300 transition-colors">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Current Active Version Card -->
          <div class="p-6 border-b border-base-300 bg-base-100">
            <div class="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="px-2.5 py-1 rounded-lg bg-tenant-500 text-white font-bold text-xs font-mono">
                    {{ crs.version.label }}
                  </span>
                  <div>
                    <span class="text-xs font-bold text-text-primary">
                      {{ crs.version.state === 'published-current' ? 'Live Current Version' : (crs.version.state === 'draft' ? 'Draft In-Progress' : 'Historical Snapshot') }}
                    </span>
                    @if (crs.version.publishedAt) {
                      <p class="text-[11px] text-text-secondary">Published {{ crs.version.publishedAt }} by {{ crs.version.publishedBy }}</p>
                    }
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    {{ crs.version.lockedInPhasesCount || crs.usedInPhasesCount || 0 }} Phases Locked
                  </span>
                </div>
              </div>

              <!-- Explanation of Independent Snapshot Model (§4.4 / BRD §Rule 4) -->
              <div class="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-text-secondary flex items-start gap-2.5">
                <span class="material-symbols-outlined text-indigo-500 text-base mt-0.5">verified_user</span>
                <div>
                  <strong class="text-indigo-600 block mb-0.5">Independent Snapshot Protection</strong>
                  Running curriculum phases pin to the exact version snapshot at assignment time. Creating or publishing a new version will never mutate or disrupt in-progress learners.
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation inside Modal -->
          <div class="px-6 pt-4 pb-0 bg-base-100 flex items-center gap-2 border-b border-base-300 overflow-x-auto">
            <button
              type="button"
              (click)="activeModalTab.set('snapshots')"
              [class.border-tenant-500]="activeModalTab() === 'snapshots'"
              [class.text-tenant-600]="activeModalTab() === 'snapshots'"
              [class.font-bold]="activeModalTab() === 'snapshots'"
              [class.border-transparent]="activeModalTab() !== 'snapshots'"
              [class.text-text-secondary]="activeModalTab() !== 'snapshots'"
              class="flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs transition-colors whitespace-nowrap cursor-pointer hover:text-tenant-600"
            >
              <span class="material-symbols-outlined text-sm">history</span>
              <span>Version Snapshots</span>
            </button>

            <button
              type="button"
              (click)="activeModalTab.set('authorHistory')"
              [class.border-tenant-500]="activeModalTab() === 'authorHistory'"
              [class.text-tenant-600]="activeModalTab() === 'authorHistory'"
              [class.font-bold]="activeModalTab() === 'authorHistory'"
              [class.border-transparent]="activeModalTab() !== 'authorHistory'"
              [class.text-text-secondary]="activeModalTab() !== 'authorHistory'"
              class="flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs transition-colors whitespace-nowrap cursor-pointer hover:text-tenant-600"
            >
              <span class="material-symbols-outlined text-sm">edit_note</span>
              <span>Author History (Who Made What)</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-base-200 border border-base-300 font-mono">
                {{ crs.authorHistory?.length || 0 }}
              </span>
            </button>

            <button
              type="button"
              (click)="activeModalTab.set('instructorHistory')"
              [class.border-tenant-500]="activeModalTab() === 'instructorHistory'"
              [class.text-tenant-600]="activeModalTab() === 'instructorHistory'"
              [class.font-bold]="activeModalTab() === 'instructorHistory'"
              [class.border-transparent]="activeModalTab() !== 'instructorHistory'"
              [class.text-text-secondary]="activeModalTab() !== 'instructorHistory'"
              class="flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs transition-colors whitespace-nowrap cursor-pointer hover:text-tenant-600"
            >
              <span class="material-symbols-outlined text-sm">school</span>
              <span>Instructor Delivery History</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-base-200 border border-base-300 font-mono">
                {{ crs.instructorHistory?.length || 0 }}
              </span>
            </button>
          </div>

          <!-- Tab Content Area -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            @if (activeModalTab() === 'snapshots') {
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold text-text-primary uppercase tracking-wider">Publication History & Snapshots</h3>
                <span class="text-xs text-text-secondary font-mono">{{ (crs.versionHistory?.length || 0) + 1 }} total iterations</span>
              </div>

              <div class="space-y-3">
                <!-- Current item -->
                <div class="p-3.5 rounded-2xl border border-tenant-500/30 bg-tenant-500/5 flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-tenant-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                      {{ crs.version.versionNumber }}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-text-primary">{{ crs.version.label }}</span>
                        <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {{ crs.status === 'published' ? 'Active Live' : 'Current Draft' }}
                        </span>
                      </div>
                      <p class="text-xs text-text-secondary mt-1">
                        {{ crs.version.changeSummary || 'Active course configuration.' }}
                      </p>
                      @if (crs.version.lockedPhaseNames && crs.version.lockedPhaseNames.length > 0) {
                        <div class="mt-2 flex flex-wrap gap-1">
                          @for (phase of crs.version.lockedPhaseNames; track phase) {
                            <span class="text-[10px] px-2 py-0.5 rounded bg-base-200 text-text-secondary border border-base-300 font-mono">
                              📌 {{ phase }}
                            </span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <!-- Historical snapshots -->
                @for (snap of crs.versionHistory || []; track snap.versionNumber) {
                  <div class="p-3.5 rounded-2xl border border-base-300 bg-base-200/30 flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-xl bg-base-300 text-text-secondary font-bold text-xs flex items-center justify-center font-mono">
                        {{ snap.versionNumber }}
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-text-primary">{{ snap.label }}</span>
                          <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-500/10 text-slate-600">
                            Archived Snapshot
                          </span>
                          <span class="text-[11px] text-text-secondary">{{ snap.publishedAt }}</span>
                        </div>
                        <p class="text-xs text-text-secondary mt-1">
                          {{ snap.changeSummary }}
                        </p>
                        @if (snap.lockedInPhases && snap.lockedInPhases.length > 0) {
                          <div class="mt-2 flex flex-wrap gap-1">
                            @for (phase of snap.lockedInPhases; track ($index)) {
                              <span class="text-[10px] px-2 py-0.5 rounded bg-base-200 text-text-secondary border border-base-300 font-mono">
                                📌 {{ phase.phaseName || phase }}
                              </span>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (activeModalTab() === 'authorHistory') {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-text-primary uppercase tracking-wider">Author Version Contribution Ledger</h3>
                  <span class="text-xs text-text-secondary font-mono">{{ crs.authorHistory?.length || 0 }} logged records</span>
                </div>

                @if (!crs.authorHistory || crs.authorHistory.length === 0) {
                  <div class="p-8 rounded-2xl bg-base-200/50 border border-base-300 text-center space-y-2">
                    <span class="material-symbols-outlined text-3xl text-text-secondary">history_edu</span>
                    <p class="text-xs text-text-secondary">No version-specific author update logs recorded yet.</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (record of crs.authorHistory; track record.id) {
                      <div class="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-2">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-mono font-bold text-xs">
                              {{ record.versionLabel }}
                            </span>
                            <span class="text-xs font-bold text-text-primary">
                              {{ record.authorName }}
                            </span>
                            <span class="text-[11px] px-2 py-0.5 rounded bg-base-200 text-text-secondary border border-base-300">
                              {{ record.authorRole }}
                            </span>
                          </div>
                          <span class="text-[11px] text-text-secondary font-mono">{{ record.timestamp }}</span>
                        </div>

                        <p class="text-xs text-text-secondary leading-relaxed font-medium">
                          {{ record.changeSummary }}
                        </p>

                        @if (record.authoredUnits && record.authoredUnits.length > 0) {
                          <div class="flex flex-wrap gap-1.5 pt-1">
                            @for (unit of record.authoredUnits; track unit) {
                              <span class="text-[10px] px-2 py-0.5 rounded bg-base-100 text-text-secondary border border-base-300">
                                📝 {{ unit }}
                              </span>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            } @else if (activeModalTab() === 'instructorHistory') {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-text-primary uppercase tracking-wider">Instructor Delivery History Ledger</h3>
                  <span class="text-xs text-text-secondary font-mono">{{ crs.instructorHistory?.length || 0 }} logged delivery records</span>
                </div>

                @if (!crs.instructorHistory || crs.instructorHistory.length === 0) {
                  <div class="p-8 rounded-2xl bg-base-200/50 border border-base-300 text-center space-y-2">
                    <span class="material-symbols-outlined text-3xl text-text-secondary">school</span>
                    <p class="text-xs text-text-secondary">No version-specific instructor delivery logs recorded yet.</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (record of crs.instructorHistory; track record.id) {
                      <div class="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-2">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono font-bold text-xs">
                              {{ record.layerTitle }}
                            </span>
                            <span class="text-xs font-bold text-text-primary">
                              {{ record.instructorName }}
                            </span>
                            <span class="text-[11px] px-2 py-0.5 rounded bg-base-200 text-text-secondary border border-base-300 uppercase">
                              Depth {{ record.layerDepth }}
                            </span>
                          </div>
                          <span class="text-[11px] text-text-secondary font-mono">Assigned: {{ record.assignedDate }}</span>
                        </div>

                        <div class="text-xs text-text-secondary flex items-center gap-2">
                          <span>Title: <strong class="text-text-primary">{{ record.instructorTitle }}</strong></span>
                          <span>•</span>
                          <span>Cohort: <strong class="text-text-primary">{{ record.cohortOrTerm || 'General Cohort' }}</strong></span>
                        </div>

                        @if (record.notes) {
                          <p class="text-xs text-text-secondary italic">
                            "{{ record.notes }}"
                          </p>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <!-- Modal Footer with New Version Trigger -->
          <div class="p-6 border-t border-base-300 bg-base-200/50 flex items-center justify-between">
            <button 
              (click)="close.emit()" 
              class="px-4 py-2.5 rounded-xl border border-base-300 hover:bg-base-200 text-text-secondary font-semibold text-xs transition-colors">
              Close
            </button>

            @if (crs.status === 'published') {
              <button 
                (click)="triggerNewVersion.emit()" 
                class="px-4 py-2.5 rounded-xl bg-tenant-500 hover:bg-tenant-600 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                <span>Create New Version (v{{ (crs.version.versionNumber || 1) + 1 }}.0 Draft)</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class CourseVersionModalComponent {
  course = input<CourseEntity | null>(null);
  close = output<void>();
  triggerNewVersion = output<void>();

  activeModalTab = signal<'snapshots' | 'authorHistory' | 'instructorHistory'>('snapshots');
}
