import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LmsDataService } from '../../../services/lms-data.service';
import { AuthorProfile, AuthorshipRecord, DeactivationBlockResolution, PersonnelAttachment, LearnerFeedbackItem } from '../../../models/author.model';
import { InstructorProfile } from '../../../models/instructor.model';
import { CustomSelectComponent, SelectOption } from '../../../components/custom-select/custom-select.component';

@Component({
  selector: 'app-author-details',
  imports: [CommonModule, FormsModule, RouterModule, CustomSelectComponent],
  templateUrl: './author-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorDetailsComponent implements OnInit {
  lms = inject(LmsDataService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  authorId = signal<string>('');
  previewModalAttachment = signal<PersonnelAttachment | null>(null);

  // Active View Switcher Tab
  activeTab = signal<'dashboard' | 'content-repo' | 'course-versions' | 'matrix' | 'provenance' | 'credentials'>('dashboard');

  // Search & Filter State
  searchQuery = signal<string>('');
  lmsInstanceFilter = signal<string>('All');
  contentTypeFilter = signal<string>('All');
  courseStatusFilter = signal<string>('All');

  // Feedback Drawer State
  activeFeedbackDrawerItem = signal<AuthorshipRecord | null>(null);

  // Active Author profile
  author = computed<AuthorProfile | undefined>(() => {
    const id = this.authorId();
    if (!id) return undefined;
    return this.lms.getAuthorById(id);
  });

  linkedInstructor = computed<InstructorProfile | null>(() => {
    const a = this.author();
    if (!a) return null;
    if (a.instructorId) {
      const byId = this.lms.getInstructorById(a.instructorId);
      if (byId) return byId;
    }
    return this.lms.getInstructorByEmail(a.email) || null;
  });

  switchToInstructorView(): void {
    const inst = this.linkedInstructor();
    if (inst) {
      this.router.navigate(['/instructors', inst.id]);
    } else if (this.author()?.instructorId) {
      this.router.navigate(['/instructors', this.author()!.instructorId]);
    }
  }

  // Authorship records for this author
  history = computed<AuthorshipRecord[]>(() => {
    const id = this.authorId();
    if (!id) return [];
    return this.lms.getAuthorshipHistory(id);
  });

  // Dynamic LMS Instance Options
  lmsInstanceOptions = computed<SelectOption[]>(() => {
    const records = this.history();
    const lmsMap = new Map<string, string>();
    records.forEach(r => {
      if (r.lmsId && r.lmsName) {
        lmsMap.set(r.lmsId, r.lmsName);
      }
    });

    const opts: SelectOption[] = [
      { value: 'All', label: 'All LMS Instances', icon: 'domain' }
    ];

    lmsMap.forEach((name, id) => {
      opts.push({
        value: id,
        label: name,
        icon: 'account_tree'
      });
    });

    return opts;
  });

  contentTypeOptions: SelectOption[] = [
    { value: 'All', label: 'All Content Types', icon: 'category' },
    { value: 'video', label: 'Video Lessons', icon: 'smart_display' },
    { value: 'document', label: 'Documents & SOPs', icon: 'description' },
    { value: 'quiz', label: 'Quizzes & Exams', icon: 'quiz' },
    { value: 'interactive', label: 'Simulations & Labs', icon: 'extension' }
  ];

  courseStatusOptions: SelectOption[] = [
    { value: 'All', label: 'All Course Statuses', icon: 'view_agenda' },
    { value: 'published', label: 'Published (Active)', icon: 'check_circle' },
    { value: 'draft', label: 'Drafts', icon: 'edit_document' }
  ];

  // Filtered Authorship Matrix History
  filteredHistory = computed(() => {
    const records = this.history();
    const query = this.searchQuery().trim().toLowerCase();
    const lmsId = this.lmsInstanceFilter();
    const cType = this.contentTypeFilter();
    const cStat = this.courseStatusFilter();

    return records.filter(r => {
      const matchLms = lmsId === 'All' || r.lmsId === lmsId;
      const matchType = cType === 'All' || r.contentType.toLowerCase() === cType.toLowerCase();
      const matchStat = cStat === 'All' || r.courseStatus.toLowerCase() === cStat.toLowerCase();
      const matchQuery = !query || 
        r.contentItemTitle.toLowerCase().includes(query) ||
        r.courseName.toLowerCase().includes(query) ||
        (r.nodeTitle && r.nodeTitle.toLowerCase().includes(query)) ||
        r.lmsName.toLowerCase().includes(query);

      return matchLms && matchType && matchStat && matchQuery;
    });
  });

  // Executive KPI Computeds
  averageRating = computed<number>(() => {
    const records = this.history().filter(r => r.rating !== undefined && r.rating > 0);
    if (records.length === 0) return 4.9;
    const sum = records.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / records.length) * 10) / 10;
  });

  averageCompletionRate = computed<number>(() => {
    const records = this.history().filter(r => r.completionRate !== undefined && r.completionRate > 0);
    if (records.length === 0) return 92;
    const sum = records.reduce((acc, r) => acc + (r.completionRate || 0), 0);
    return Math.round(sum / records.length);
  });

  totalLearnersReached = computed<number>(() => {
    const records = this.history();
    const sum = records.reduce((acc, r) => acc + (r.learnersCount || 350), 0);
    return sum;
  });

  totalAuthoredItems = computed(() => this.history().length);
  videoCount = computed(() => this.history().filter(r => r.contentType === 'video').length);
  docCount = computed(() => this.history().filter(r => r.contentType === 'document' || r.contentType === 'reading').length);
  quizCount = computed(() => this.history().filter(r => r.contentType === 'quiz' || r.contentType === 'interactive' || r.contentType === 'assignment').length);

  activeCoursesCount = computed(() => {
    const uniqueCourses = new Set(this.history().filter(r => r.courseStatus.toLowerCase() === 'published').map(r => r.courseId));
    return uniqueCourses.size || 1;
  });

  uniqueLmsNodesCount = computed(() => {
    const uniqueNodes = new Set(this.history().map(r => r.lmsId));
    return uniqueNodes.size || 1;
  });

  // All reviews for feedback section
  allFeedbackReviews = computed<Array<LearnerFeedbackItem & { itemTitle: string; courseName: string }>>(() => {
    const list: Array<LearnerFeedbackItem & { itemTitle: string; courseName: string }> = [];
    this.history().forEach(record => {
      if (record.feedbackReviews && record.feedbackReviews.length > 0) {
        record.feedbackReviews.forEach(rev => {
          list.push({
            ...rev,
            itemTitle: record.contentItemTitle,
            courseName: record.courseName
          });
        });
      }
    });
    return list;
  });

  // Content Repository Items Aligned with Author
  contentRepoItems = computed(() => {
    const id = this.authorId();
    if (!id) return [];
    return this.lms.getAuthorContentRepositoryItems(id);
  });

  // Course Versions authored/updated by this author
  courseVersionHistory = computed(() => {
    const id = this.authorId();
    if (!id) return [];
    return this.lms.getAuthorCourseVersionHistory(id);
  });

  // Provenance Items list
  provenanceItems = computed(() => {
    return this.history().map(r => ({
      item: r,
      provenanceCount: (r.provenance ? r.provenance.length : 1),
      nodes: r.provenance || [r.courseName, 'Main Core LMS Repository']
    }));
  });

  // Blocked Deactivation Modal State
  showBlockedModal = signal<boolean>(false);
  blockedActiveRecords = signal<AuthorshipRecord[]>([]);
  reassignmentSelections = signal<Record<string, string>>({});

  // Tag as Instructor Modal State
  showTagInstructorModal = signal<boolean>(false);
  tagInstructorTitle = signal<string>('Senior Faculty Instructor');
  tagInstructorDepartment = signal<string>('Academic Faculty & Training');
  tagInstructorSpecialization = signal<string>('');
  isTaggingInstructor = signal<boolean>(false);

  replacementAuthors = computed(() => {
    const current = this.author();
    if (!current) return this.lms.activeAuthors();
    return this.lms.activeAuthors().filter(a => a.id !== current.id);
  });

  replacementAuthorOptions = computed<SelectOption[]>(() => {
    return this.replacementAuthors().map(cand => ({
      value: cand.id,
      label: cand.name,
      sublabel: cand.specialization,
      avatar: cand.avatar
    }));
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.authorId.set(id);
      }
    });
  }

  openFeedbackDrawer(item: AuthorshipRecord): void {
    this.activeFeedbackDrawerItem.set(item);
  }

  closeFeedbackDrawer(): void {
    this.activeFeedbackDrawerItem.set(null);
  }

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

  handleToggleStatus(): void {
    const current = this.author();
    if (!current) return;

    if (current.status === 'Inactive') {
      this.lms.activateAuthor(current.id);
      return;
    }

    // Attempting to deactivate - check blocked rule
    const check = this.lms.checkAuthorDeactivationBlocked(current.id);
    if (check.isBlocked) {
      this.blockedActiveRecords.set(check.activeRecords);
      const initialReplacements: Record<string, string> = {};
      const firstAvailable = this.lms.activeAuthors().find(a => a.id !== current.id);
      if (firstAvailable) {
        check.activeRecords.forEach(r => {
          initialReplacements[r.contentItemId + '_' + r.courseId] = firstAvailable.id;
        });
      }
      this.reassignmentSelections.set(initialReplacements);
      this.showBlockedModal.set(true);
    } else {
      this.lms.deactivateAuthor(current.id);
    }
  }

  closeBlockedModal(): void {
    this.showBlockedModal.set(false);
    this.blockedActiveRecords.set([]);
  }

  setReplacementSelection(key: string, replacementAuthorId: string): void {
    this.reassignmentSelections.update(map => ({ ...map, [key]: replacementAuthorId }));
  }

  resolveItemReassign(record: AuthorshipRecord): void {
    const key = record.contentItemId + '_' + record.courseId;
    const replacementId = this.reassignmentSelections()[key];
    if (!replacementId) {
      this.lms.showToast('Please select a replacement author first.', 'error', 3000, 'Selection Required');
      return;
    }

    const resolution: DeactivationBlockResolution = {
      contentItemId: record.contentItemId,
      courseId: record.courseId,
      action: 'reassign',
      replacementAuthorId: replacementId
    };

    this.lms.resolveAuthorCredit(resolution);
    this.blockedActiveRecords.update(list => list.filter(r => !(r.contentItemId === record.contentItemId && r.courseId === record.courseId)));
  }

  resolveItemRemove(record: AuthorshipRecord): void {
    const resolution: DeactivationBlockResolution = {
      contentItemId: record.contentItemId,
      courseId: record.courseId,
      action: 'remove'
    };

    this.lms.resolveAuthorCredit(resolution);
    this.blockedActiveRecords.update(list => list.filter(r => !(r.contentItemId === record.contentItemId && r.courseId === record.courseId)));
  }

  finalizeDeactivationAfterResolutions(): void {
    const current = this.author();
    if (!current) return;

    if (this.blockedActiveRecords().length > 0) {
      this.lms.showToast(`Please reassign or remove all ${this.blockedActiveRecords().length} remaining active course credits before finalizing deactivation.`, 'error', 4000, 'Credits Unresolved');
      return;
    }

    this.lms.deactivateAuthor(current.id, true);
    this.closeBlockedModal();
  }

  openTagInstructorModal(): void {
    const a = this.author();
    if (!a) return;
    this.tagInstructorTitle.set('Senior Faculty Instructor');
    this.tagInstructorDepartment.set('Academic Faculty & Training');
    this.tagInstructorSpecialization.set(a.specialization || 'Instructional Pedagogy');
    this.showTagInstructorModal.set(true);
  }

  closeTagInstructorModal(): void {
    this.showTagInstructorModal.set(false);
  }

  confirmTagAsInstructor(): void {
    const a = this.author();
    if (!a) return;

    this.isTaggingInstructor.set(true);
    const specs = this.tagInstructorSpecialization()
      ? this.tagInstructorSpecialization().split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const result = this.lms.tagAuthorAsInstructor(a.id, {
      title: this.tagInstructorTitle().trim(),
      department: this.tagInstructorDepartment().trim(),
      specialization: specs
    });

    this.isTaggingInstructor.set(false);
    this.showTagInstructorModal.set(false);

    if (result.success && result.instructor) {
      // Toast has already been sent by lms service
    }
  }

  getContentTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'video': return 'smart_display';
      case 'document':
      case 'reading': return 'description';
      case 'quiz': return 'quiz';
      case 'interactive':
      case 'lab': return 'extension';
      default: return 'article';
    }
  }

  getContentTypeBadgeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'video': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
      case 'document':
      case 'reading': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      case 'quiz': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
      case 'interactive':
      case 'lab': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  }
}
