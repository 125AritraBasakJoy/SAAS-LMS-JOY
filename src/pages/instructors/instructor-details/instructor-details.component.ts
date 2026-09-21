import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LmsDataService } from '../../../services/lms-data.service';
import {
  InstructorProfile,
  InstructorAssignmentRecord,
  InstructorDeactivationResolution
} from '../../../models/instructor.model';
import { PersonnelAttachment, AuthorProfile } from '../../../models/author.model';
import { ComposeEmailModalComponent, EmailRecipientInfo } from '../../../components/compose-email-modal/compose-email-modal.component';
import { CustomSelectComponent, SelectOption } from '../../../components/custom-select/custom-select.component';

@Component({
  selector: 'app-instructor-details',
  imports: [CommonModule, FormsModule, RouterModule, ComposeEmailModalComponent, CustomSelectComponent],
  templateUrl: './instructor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDetailsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  lms = inject(LmsDataService);

  instructorId = signal<string>('');
  previewModalAttachment = signal<PersonnelAttachment | null>(null);

  statusOptions: SelectOption[] = [
    { value: 'Active', label: 'Active (Available for Assignment)', icon: 'check_circle' },
    { value: 'Inactive', label: 'Inactive (Deactivated)', icon: 'cancel' }
  ];

  getFileIcon(attachment: PersonnelAttachment): string {
    const ext = attachment.name.split('.').pop()?.toLowerCase() || '';
    if (attachment.isImage || attachment.type.startsWith('image/')) return 'image';
    if (attachment.type.includes('pdf') || ext === 'pdf') return 'picture_as_pdf';
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext) || attachment.type.includes('word')) return 'description';
    if (['xls', 'xlsx', 'csv'].includes(ext) || attachment.type.includes('sheet')) return 'table_chart';
    if (['ppt', 'pptx'].includes(ext) || attachment.type.includes('presentation')) return 'slideshow';
    if (attachment.type.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video_file';
    if (attachment.type.startsWith('audio/') || ['mp3', 'wav', 'aac', 'ogg', 'm4a'].includes(ext)) return 'audio_file';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || attachment.type.includes('zip')) return 'folder_zip';
    return 'draft';
  }

  openPreview(att: PersonnelAttachment): void {
    this.previewModalAttachment.set(att);
  }

  closePreview(): void {
    this.previewModalAttachment.set(null);
  }

  downloadAttachment(att: PersonnelAttachment): void {
    if (!att.url) return;
    const a = document.createElement('a');
    a.href = att.url;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.lms.showToast(`Downloading "${att.name}"...`, 'info', 2000);
  }

  // View Mode Switcher
  activeTab = signal<'dashboard' | 'delivery-history' | 'matrix' | 'credentials'>('dashboard');

  // Teaching Delivery & Version History
  teachingDeliveryHistory = computed(() => {
    const inst = this.instructor();
    if (!inst) return [];
    return this.lms.getInstructorTeachingHistory(inst.id);
  });

  // Filters & Search
  searchQuery = signal<string>('');
  lmsInstanceFilter = signal<string>('all');
  layerTypeFilter = signal<string>('all');
  courseStatusFilter = signal<string>('all');

  // Expandable Feedback Drawer
  activeFeedbackDrawerItem = signal<InstructorAssignmentRecord | null>(null);

  // Email Modal State (§5)
  showEmailModal = signal<boolean>(false);
  emailRecipient = signal<EmailRecipientInfo | null>(null);

  // Blocked Deactivation Modal State (§3.4)
  showBlockedModal = signal<boolean>(false);
  blockedActiveRecords = signal<InstructorAssignmentRecord[]>([]);
  reassignmentSelections = signal<Record<string, string>>({});

  // Tag as Author Modal State
  showTagAuthorModal = signal<boolean>(false);
  tagAuthorSpecialization = signal<string>('Curricular Content & Assessments');
  isTaggingAuthor = signal<boolean>(false);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.instructorId.set(id);
      }
    });
  }

  instructor = computed<InstructorProfile | null>(() => {
    const id = this.instructorId();
    if (!id) return null;
    return this.lms.getInstructorById(id) || null;
  });

  linkedAuthor = computed<AuthorProfile | null>(() => {
    const inst = this.instructor();
    if (!inst) return null;
    if (inst.authorId) {
      const byId = this.lms.getAuthorById(inst.authorId);
      if (byId) return byId;
    }
    return this.lms.getAuthorByEmail(inst.email) || null;
  });

  switchToAuthorView(): void {
    const author = this.linkedAuthor();
    if (author) {
      this.router.navigate(['/authors', author.id]);
    } else if (this.instructor()?.authorId) {
      this.router.navigate(['/authors', this.instructor()!.authorId]);
    }
  }

  assignmentHistory = computed<InstructorAssignmentRecord[]>(() => {
    const inst = this.instructor();
    if (!inst) return [];
    return this.lms.getInstructorAssignments(inst.id);
  });

  // Filtered History
  filteredHistory = computed(() => {
    const history = this.assignmentHistory();
    const query = this.searchQuery().toLowerCase().trim();
    const lmsFilter = this.lmsInstanceFilter();
    const layerFilter = this.layerTypeFilter();
    const statusFilter = this.courseStatusFilter();

    return history.filter(record => {
      if (lmsFilter !== 'all' && record.lmsId !== lmsFilter) return false;
      if (layerFilter !== 'all' && record.layerType !== layerFilter) return false;
      if (statusFilter !== 'all' && record.courseStatus !== statusFilter) return false;

      if (query) {
        const matchTitle = record.courseName.toLowerCase().includes(query);
        const matchLayer = record.layer.toLowerCase().includes(query);
        const matchLms = record.lmsName.toLowerCase().includes(query);
        return matchTitle || matchLayer || matchLms;
      }
      return true;
    });
  });

  // Executive KPI Computations
  kpiStats = computed(() => {
    const history = this.assignmentHistory();
    if (history.length === 0) {
      return {
        avgRating: (this.instructor()?.rating || 4.9).toFixed(1),
        completionRate: 92,
        learnersReached: 2450,
        assignedUnitsCount: 0,
        activeCoursesCount: 0,
        totalReviews: 48
      };
    }

    let totalRating = 0;
    let ratingCount = 0;
    let totalCompletion = 0;
    let completionCount = 0;
    let totalLearners = 0;
    let totalReviews = 0;
    const activeCourseIds = new Set<string>();

    for (const item of history) {
      if (item.rating) {
        totalRating += item.rating;
        ratingCount++;
      }
      if (item.completionRate) {
        totalCompletion += item.completionRate;
        completionCount++;
      }
      if (item.learnersCount) {
        totalLearners += item.learnersCount;
      }
      if (item.reviewsCount) {
        totalReviews += item.reviewsCount;
      }
      if (item.courseStatus === 'Published') {
        activeCourseIds.add(item.courseId);
      }
    }

    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : (this.instructor()?.rating || 4.9).toFixed(1);
    const avgCompletion = completionCount > 0 ? Math.round(totalCompletion / completionCount) : 92;

    return {
      avgRating,
      completionRate: avgCompletion,
      learnersReached: totalLearners > 0 ? totalLearners : 2450,
      assignedUnitsCount: history.length,
      activeCoursesCount: activeCourseIds.size || history.length,
      totalReviews: totalReviews > 0 ? totalReviews : 48
    };
  });

  // Aggregated Feedback for Drawer & Dashboard
  allLearnerFeedback = computed(() => {
    const history = this.assignmentHistory();
    const reviews: { courseName: string; layer: string; feedback: NonNullable<InstructorAssignmentRecord['feedbackReviews']>[0] }[] = [];
    for (const record of history) {
      if (record.feedbackReviews && record.feedbackReviews.length > 0) {
        for (const f of record.feedbackReviews) {
          reviews.push({
            courseName: record.courseName,
            layer: record.layer,
            feedback: f
          });
        }
      }
    }
    return reviews;
  });

  openFeedbackDrawer(record: InstructorAssignmentRecord): void {
    this.activeFeedbackDrawerItem.set(record);
  }

  closeFeedbackDrawer(): void {
    this.activeFeedbackDrawerItem.set(null);
  }

  // Candidate replacement instructors for deactivation block modal
  replacementInstructors = computed(() => {
    const inst = this.instructor();
    if (!inst) return this.lms.activeInstructors();
    return this.lms.activeInstructors().filter(i => i.id !== inst.id);
  });

  resolutionOptions = computed<SelectOption[]>(() => {
    const options: SelectOption[] = [
      { value: 'remove', label: 'Remove Tag from this Layer', icon: 'delete' }
    ];
    for (const rep of this.replacementInstructors()) {
      options.push({
        value: rep.id,
        label: `Reassign to: ${rep.name}`,
        sublabel: `${rep.email} • ${rep.specialization.join(', ')}`,
        avatar: rep.avatar
      });
    }
    return options;
  });

  openEmailModal(): void {
    const inst = this.instructor();
    if (!inst) return;
    this.emailRecipient.set({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      avatar: inst.avatar,
      role: 'Instructor'
    });
    this.showEmailModal.set(true);
  }

  openTagAuthorModal(): void {
    const inst = this.instructor();
    if (!inst) return;
    const spec = Array.isArray(inst.specialization) ? inst.specialization.join(', ') : inst.specialization;
    this.tagAuthorSpecialization.set(spec || 'Instructional Content & Case Studies');
    this.showTagAuthorModal.set(true);
  }

  closeTagAuthorModal(): void {
    this.showTagAuthorModal.set(false);
  }

  confirmTagAsAuthor(): void {
    const inst = this.instructor();
    if (!inst) return;

    this.isTaggingAuthor.set(true);
    const result = this.lms.tagInstructorAsAuthor(inst.id, {
      specialization: this.tagAuthorSpecialization().trim()
    });

    this.isTaggingAuthor.set(false);
    this.showTagAuthorModal.set(false);
  }

  openEditModal(): void {
    const inst = this.instructor();
    if (!inst) return;
    this.router.navigate(['/instructors/edit', inst.id]);
  }

  toggleStatus(): void {
    const inst = this.instructor();
    if (!inst) return;

    if (inst.status === 'Inactive') {
      this.lms.activateInstructor(inst.id);
    } else {
      const blockCheck = this.lms.checkInstructorDeactivationBlocked(inst.id);
      if (blockCheck.isBlocked) {
        this.blockedActiveRecords.set(blockCheck.activeRecords);
        this.reassignmentSelections.set({});
        this.showBlockedModal.set(true);
      } else {
        this.lms.deactivateInstructor(inst.id);
      }
    }
  }

  setResolutionAction(assignmentId: string, actionOrId: string): void {
    this.reassignmentSelections.update(map => ({
      ...map,
      [assignmentId]: actionOrId
    }));
  }

  resolveAndDeactivate(): void {
    const inst = this.instructor();
    if (!inst) return;

    const records = this.blockedActiveRecords();
    const selections = this.reassignmentSelections();

    let allResolved = true;
    for (const rec of records) {
      const selected = selections[rec.id];
      if (selected === 'remove') {
        this.lms.resolveInstructorAssignment({
          assignmentId: rec.id,
          courseId: rec.courseId,
          layer: rec.layer,
          action: 'remove'
        });
      } else if (selected && selected !== '') {
        this.lms.resolveInstructorAssignment({
          assignmentId: rec.id,
          courseId: rec.courseId,
          layer: rec.layer,
          action: 'reassign',
          replacementInstructorId: selected
        });
      } else {
        allResolved = false;
      }
    }

    if (!allResolved) {
      this.lms.showToast('Please specify an action for each active assignment before deactivating.', 'error', 4000, 'Action Required');
      return;
    }

    this.lms.deactivateInstructor(inst.id, true);
    this.showBlockedModal.set(false);
  }
}
